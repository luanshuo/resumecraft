package db

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `gorm:"size:100;not null" json:"name"`
	Email     string         `gorm:"size:200;uniqueIndex;not null" json:"email"`
	Password  string         `gorm:"size:255;not null" json:"-"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	Resumes   []Resume       `gorm:"foreignKey:UserID" json:"resumes,omitempty"`
}

type Resume struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"index;not null" json:"user_id"`
	Name      string    `gorm:"size:200;not null" json:"name"`
	Template  string    `gorm:"size:50;default:minimal" json:"template"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	Sections  []Section `gorm:"foreignKey:ResumeID" json:"sections,omitempty"`
}

type Section struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	ResumeID  uint      `gorm:"index;not null" json:"resume_id"`
	Type      string    `gorm:"size:50;not null" json:"type"` // personal, experience, education, skill, project, summary
	SortOrder int       `gorm:"default:0" json:"sort_order"`
	Data      string    `gorm:"type:text" json:"data"` // JSON
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
