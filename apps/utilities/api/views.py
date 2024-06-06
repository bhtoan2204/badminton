from rest_framework.response import Response # type: ignore
from rest_framework.decorators import api_view # type: ignore

@api_view(['GET'])
def getData(request):
    data = {
        'name': 'John Doe',
        'age': 25,
        'location': 'USA'
    }
    return Response(data)