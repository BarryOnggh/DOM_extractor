from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # 1. Define your variables and their expected types
    gemini_api_key: str
    debug_mode: bool = False
    port: int = 8000

    # 2. Tell Pydantic to read from the .env file
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"  # Ignores extra variables in the .env that aren't defined here
    )

# 3. Instantiate the settings object once so it can be imported elsewhere
settings = Settings()