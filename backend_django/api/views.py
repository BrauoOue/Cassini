from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response


# Create your views here.
@api_view(http_method_names=["GET"])
def hello(request):
    return Response("Hello World from Django")