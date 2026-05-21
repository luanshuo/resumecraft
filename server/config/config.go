package config

import "os"

type Config struct {
	Port     string
	DBPath   string
	DBType   string
	JWTKey   string
}

func Load() *Config {
	return &Config{
		Port:   getEnv("PORT", "8080"),
		DBType: getEnv("DB_TYPE", "sqlite"),
		DBPath: getEnv("DB_PATH", "./jianli.db"),
		JWTKey: getEnv("JWT_KEY", "jianli-secret-key-change-in-production"),
	}
}

func getEnv(key, defaultVal string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return defaultVal
}
