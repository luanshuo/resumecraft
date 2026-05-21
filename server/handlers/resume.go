package handlers

import (
	"encoding/json"
	"strconv"

	"jianli/db"

	"github.com/gin-gonic/gin"
)

func parseUintParam(c *gin.Context, param string) uint {
	v, _ := strconv.ParseUint(c.Param(param), 10, 64)
	return uint(v)
}

type ResumeHandler struct{}

func (h *ResumeHandler) List(c *gin.Context) {
	userID := c.GetUint("user_id")
	var resumes []db.Resume
	if err := db.DB.Where("user_id = ?", userID).Order("updated_at desc").Find(&resumes).Error; err != nil {
		c.JSON(500, gin.H{"error": "internal error"})
		return
	}
	c.JSON(200, resumes)
}

func (h *ResumeHandler) Create(c *gin.Context) {
	userID := c.GetUint("user_id")
	var req struct {
		Name     string `json:"name" binding:"required"`
		Template string `json:"template"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	if req.Template == "" {
		req.Template = "minimal"
	}

	resume := db.Resume{UserID: userID, Name: req.Name, Template: req.Template}
	if err := db.DB.Create(&resume).Error; err != nil {
		c.JSON(500, gin.H{"error": "internal error"})
		return
	}
	c.JSON(201, resume)
}

func (h *ResumeHandler) Get(c *gin.Context) {
	userID := c.GetUint("user_id")
	id := parseUintParam(c, "id")

	var resume db.Resume
	if err := db.DB.Where("id = ? AND user_id = ?", id, userID).Preload("Sections").First(&resume).Error; err != nil {
		c.JSON(404, gin.H{"error": "resume not found"})
		return
	}
	c.JSON(200, resume)
}

func (h *ResumeHandler) Update(c *gin.Context) {
	userID := c.GetUint("user_id")
	id := parseUintParam(c, "id")

	var resume db.Resume
	if err := db.DB.Where("id = ? AND user_id = ?", id, userID).First(&resume).Error; err != nil {
		c.JSON(404, gin.H{"error": "resume not found"})
		return
	}

	var req struct {
		Name     string `json:"name"`
		Template string `json:"template"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	if req.Name != "" {
		resume.Name = req.Name
	}
	if req.Template != "" {
		resume.Template = req.Template
	}

	if err := db.DB.Save(&resume).Error; err != nil {
		c.JSON(500, gin.H{"error": "internal error"})
		return
	}
	c.JSON(200, resume)
}

func (h *ResumeHandler) Delete(c *gin.Context) {
	userID := c.GetUint("user_id")
	id := parseUintParam(c, "id")

	result := db.DB.Where("id = ? AND user_id = ?", id, userID).Delete(&db.Resume{})
	if result.RowsAffected == 0 {
		c.JSON(404, gin.H{"error": "resume not found"})
		return
	}
	c.JSON(200, gin.H{"message": "deleted"})
}

func (h *ResumeHandler) Copy(c *gin.Context) {
	userID := c.GetUint("user_id")
	id := parseUintParam(c, "id")

	var original db.Resume
	if err := db.DB.Where("id = ? AND user_id = ?", id, userID).Preload("Sections").First(&original).Error; err != nil {
		c.JSON(404, gin.H{"error": "resume not found"})
		return
	}

	newResume := db.Resume{
		UserID:   userID,
		Name:     original.Name + " (副本)",
		Template: original.Template,
	}
	if err := db.DB.Create(&newResume).Error; err != nil {
		c.JSON(500, gin.H{"error": "internal error"})
		return
	}

	for _, s := range original.Sections {
		newSection := db.Section{
			ResumeID:  newResume.ID,
			Type:      s.Type,
			SortOrder: s.SortOrder,
			Data:      s.Data,
		}
		db.DB.Create(&newSection)
	}

	db.DB.Preload("Sections").First(&newResume, newResume.ID)
	c.JSON(201, newResume)
}

// SectionHandler 区块管理
type SectionHandler struct{}

func (h *SectionHandler) Get(c *gin.Context) {
	resumeID := parseUintParam(c, "resume_id")

	var sections []db.Section
	if err := db.DB.Where("resume_id = ? AND data != ''", resumeID).
		Order("sort_order asc").
		Find(&sections).Error; err != nil {
		c.JSON(500, gin.H{"error": "internal error"})
		return
	}
	c.JSON(200, sections)
}

func (h *SectionHandler) UpdateAll(c *gin.Context) {
	userID := c.GetUint("user_id")
	resumeID := parseUintParam(c, "resume_id")

	var count int64
	db.DB.Model(&db.Resume{}).Where("id = ? AND user_id = ?", resumeID, userID).Count(&count)
	if count == 0 {
		c.JSON(404, gin.H{"error": "resume not found"})
		return
	}

	var req struct {
		Sections []struct {
			ID        uint   `json:"id"`
			Type      string `json:"type"`
			SortOrder int    `json:"sort_order"`
			Data      string `json:"data"`
		} `json:"sections"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db.DB.Where("resume_id = ?", resumeID).Delete(&db.Section{})

	for _, s := range req.Sections {
		section := db.Section{
			ID:        s.ID,
			ResumeID:  resumeID,
			Type:      s.Type,
			SortOrder: s.SortOrder,
			Data:      s.Data,
		}
		if s.ID > 0 {
			db.DB.Save(&section)
		} else {
			db.DB.Create(&section)
		}
	}

	c.JSON(200, gin.H{"message": "updated"})
}

func (h *SectionHandler) Add(c *gin.Context) {
	userID := c.GetUint("user_id")
	resumeID := parseUintParam(c, "resume_id")
	sectionType := c.Param("type")

	var req map[string]interface{}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Verify ownership
	var count int64
	db.DB.Model(&db.Resume{}).Where("id = ? AND user_id = ?", resumeID, userID).Count(&count)
	if count == 0 {
		c.JSON(404, gin.H{"error": "resume not found"})
		return
	}

	var maxOrder int
	db.DB.Raw("SELECT COALESCE(MAX(sort_order), 0) FROM sections WHERE resume_id = ?", resumeID).Scan(&maxOrder)

	dataBytes, _ := json.Marshal(req)
	section := db.Section{
		ResumeID:  resumeID,
		Type:      sectionType,
		SortOrder: maxOrder + 1,
		Data:      string(dataBytes),
	}
	db.DB.Create(&section)
	c.JSON(201, section)
}
