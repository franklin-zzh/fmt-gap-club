from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    PROJECT_NAME: str = "FMT GapClub Platform"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = ""  # 必须从 .env 提供
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    ALGORITHM: str = "HS256"
    DATABASE_URL: str = ""  # 必须从 .env 提供
    UPLOAD_DIR: str = "./app/static/uploads"
    REPORT_DIR: str = "./app/static/reports"

    # 阿里云 OSS 配置（生产环境请在 .env 中填写 AK/SK）
    ALIYUN_OSS_ACCESS_KEY_ID: str = ""
    ALIYUN_OSS_ACCESS_KEY_SECRET: str = ""
    ALIYUN_OSS_BUCKET_NAME: str = "fmt-gap-club"
    ALIYUN_OSS_ENDPOINT: str = "oss-cn-beijing.aliyuncs.com"
    ALIYUN_OSS_CDN_BASE_URL: str = "https://assets.gapclub.fmtcloud.cn"
    ALIYUN_OSS_PRODUCTS_PREFIX: str = "products"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.SECRET_KEY:
            raise ValueError("SECRET_KEY 未配置：请在 .env 中设置 SECRET_KEY")
        if not self.DATABASE_URL:
            raise ValueError("DATABASE_URL 未配置：请在 .env 中设置 DATABASE_URL")


@lru_cache()
def get_settings() -> Settings:
    return Settings()
