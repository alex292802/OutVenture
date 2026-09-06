from django.contrib import admin
from django.urls import path
from core.views import (
    get_weather,
    validate_city,
    ActivityListView,
    CurrentUserView,
    RegisterView,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("weather/", get_weather),
    path("activities/", ActivityListView.as_view()),
    path("city/", validate_city),
    path("token/", TokenObtainPairView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("register/", RegisterView.as_view()),
    path("current-user/", CurrentUserView.as_view()),
]
