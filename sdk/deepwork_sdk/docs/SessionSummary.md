# SessionSummary


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **int** |  | 
**title** | **str** |  | 
**goal** | **str** |  | 
**scheduled_duration** | **int** |  | 
**actual_duration** | **int** |  | 
**pauses_count** | **int** |  | 
**status** | **str** |  | 
**start_time** | **datetime** |  | 
**end_time** | **datetime** |  | 
**interruptions** | [**List[InterruptionRead]**](InterruptionRead.md) |  | [optional] [default to []]

## Example

```python
from openapi_client.models.session_summary import SessionSummary

# TODO update the JSON string below
json = "{}"
# create an instance of SessionSummary from a JSON string
session_summary_instance = SessionSummary.from_json(json)
# print the JSON string representation of the object
print(SessionSummary.to_json())

# convert the object into a dict
session_summary_dict = session_summary_instance.to_dict()
# create an instance of SessionSummary from a dict
session_summary_from_dict = SessionSummary.from_dict(session_summary_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


