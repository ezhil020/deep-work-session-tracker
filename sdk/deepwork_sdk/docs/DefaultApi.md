# openapi_client.DefaultApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**complete_session_sessions_session_id_complete_patch**](DefaultApi.md#complete_session_sessions_session_id_complete_patch) | **PATCH** /sessions/{session_id}/complete | Complete Session
[**create_session_sessions_post**](DefaultApi.md#create_session_sessions_post) | **POST** /sessions/ | Create Session
[**get_sessions_history_sessions_history_get**](DefaultApi.md#get_sessions_history_sessions_history_get) | **GET** /sessions/history | Get Sessions History
[**pause_session_sessions_session_id_pause_patch**](DefaultApi.md#pause_session_sessions_session_id_pause_patch) | **PATCH** /sessions/{session_id}/pause | Pause Session
[**resume_session_sessions_session_id_resume_patch**](DefaultApi.md#resume_session_sessions_session_id_resume_patch) | **PATCH** /sessions/{session_id}/resume | Resume Session
[**start_session_sessions_session_id_start_patch**](DefaultApi.md#start_session_sessions_session_id_start_patch) | **PATCH** /sessions/{session_id}/start | Start Session


# **complete_session_sessions_session_id_complete_patch**
> SessionRead complete_session_sessions_session_id_complete_patch(session_id)

Complete Session

### Example


```python
import openapi_client
from openapi_client.models.session_read import SessionRead
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    session_id = 56 # int | 

    try:
        # Complete Session
        api_response = api_instance.complete_session_sessions_session_id_complete_patch(session_id)
        print("The response of DefaultApi->complete_session_sessions_session_id_complete_patch:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->complete_session_sessions_session_id_complete_patch: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **session_id** | **int**|  | 

### Return type

[**SessionRead**](SessionRead.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **create_session_sessions_post**
> SessionRead create_session_sessions_post(session_create)

Create Session

### Example


```python
import openapi_client
from openapi_client.models.session_create import SessionCreate
from openapi_client.models.session_read import SessionRead
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    session_create = openapi_client.SessionCreate() # SessionCreate | 

    try:
        # Create Session
        api_response = api_instance.create_session_sessions_post(session_create)
        print("The response of DefaultApi->create_session_sessions_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->create_session_sessions_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **session_create** | [**SessionCreate**](SessionCreate.md)|  | 

### Return type

[**SessionRead**](SessionRead.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_sessions_history_sessions_history_get**
> List[SessionSummary] get_sessions_history_sessions_history_get(offset=offset, limit=limit)

Get Sessions History

### Example


```python
import openapi_client
from openapi_client.models.session_summary import SessionSummary
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    offset = 0 # int |  (optional) (default to 0)
    limit = 100 # int |  (optional) (default to 100)

    try:
        # Get Sessions History
        api_response = api_instance.get_sessions_history_sessions_history_get(offset=offset, limit=limit)
        print("The response of DefaultApi->get_sessions_history_sessions_history_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->get_sessions_history_sessions_history_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **offset** | **int**|  | [optional] [default to 0]
 **limit** | **int**|  | [optional] [default to 100]

### Return type

[**List[SessionSummary]**](SessionSummary.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **pause_session_sessions_session_id_pause_patch**
> SessionRead pause_session_sessions_session_id_pause_patch(session_id, pause_request)

Pause Session

### Example


```python
import openapi_client
from openapi_client.models.pause_request import PauseRequest
from openapi_client.models.session_read import SessionRead
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    session_id = 56 # int | 
    pause_request = openapi_client.PauseRequest() # PauseRequest | 

    try:
        # Pause Session
        api_response = api_instance.pause_session_sessions_session_id_pause_patch(session_id, pause_request)
        print("The response of DefaultApi->pause_session_sessions_session_id_pause_patch:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->pause_session_sessions_session_id_pause_patch: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **session_id** | **int**|  | 
 **pause_request** | [**PauseRequest**](PauseRequest.md)|  | 

### Return type

[**SessionRead**](SessionRead.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **resume_session_sessions_session_id_resume_patch**
> SessionRead resume_session_sessions_session_id_resume_patch(session_id)

Resume Session

### Example


```python
import openapi_client
from openapi_client.models.session_read import SessionRead
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    session_id = 56 # int | 

    try:
        # Resume Session
        api_response = api_instance.resume_session_sessions_session_id_resume_patch(session_id)
        print("The response of DefaultApi->resume_session_sessions_session_id_resume_patch:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->resume_session_sessions_session_id_resume_patch: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **session_id** | **int**|  | 

### Return type

[**SessionRead**](SessionRead.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **start_session_sessions_session_id_start_patch**
> SessionRead start_session_sessions_session_id_start_patch(session_id)

Start Session

### Example


```python
import openapi_client
from openapi_client.models.session_read import SessionRead
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    session_id = 56 # int | 

    try:
        # Start Session
        api_response = api_instance.start_session_sessions_session_id_start_patch(session_id)
        print("The response of DefaultApi->start_session_sessions_session_id_start_patch:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->start_session_sessions_session_id_start_patch: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **session_id** | **int**|  | 

### Return type

[**SessionRead**](SessionRead.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

