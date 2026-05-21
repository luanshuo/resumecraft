package main

import (
	"log"

	"jianli/auth"
	"jianli/config"
	"jianli/db"
	"jianli/handlers"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()
	db.Init(cfg)
	auth.Init(cfg)

	h := &handlers.ResumeHandler{}
	sh := &handlers.SectionHandler{}
	ah := &auth.Handler{}

	r := gin.Default()

	// CORS
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type,Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	api := r.Group("/api/v1")
	{
		// Public auth routes
		authG := api.Group("/auth")
		{
			authG.POST("/register", ah.Register)
			authG.POST("/login", ah.Login)
			authG.Use(auth.AuthRequired())
			{
				authG.GET("/me", ah.Me)
			}
		}

		// Protected routes
		api.Use(auth.AuthRequired())
		{
			// Resume CRUD
			resumes := api.Group("/resumes")
			{
				resumes.GET("", h.List)
				resumes.POST("", h.Create)
				resumes.GET("/:id", h.Get)
				resumes.PUT("/:id", h.Update)
				resumes.DELETE("/:id", h.Delete)
				resumes.POST("/:id/copy", h.Copy)

				// Sections
				resumes.GET("/:id/sections", sh.Get)
				resumes.PUT("/:id/sections", sh.UpdateAll)
				resumes.POST("/:id/sections/:type", sh.Add)
			}
		}
	}

	// Serve frontend
	r.Static("/app", "../webapp")
	r.StaticFile("/", "../webapp/index.html")

	log.Println("server starting on :8080")
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}
