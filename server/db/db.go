package db

import (
	"log"

	"jianli/config"

	"gorm.io/driver/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Init(cfg *config.Config) {
	var err error
	switch cfg.DBType {
	case "mysql":
		DB, err = gorm.Open(mysql.Open(cfg.DBPath), &gorm.Config{})
	default:
		DB, err = gorm.Open(sqlite.Open(cfg.DBPath), &gorm.Config{})
	}
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}
	log.Println("database connected")
	Migrate()
}

func Migrate() {
	DB.AutoMigrate(&User{}, &Resume{}, &Section{})
	log.Println("database migrated")
}
