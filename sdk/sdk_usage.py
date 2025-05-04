# sdk/sdk_usage.py

import sys
import os
from datetime import datetime

# --- 1. Make sure Python can find the generated SDK ---
# We assume this script and the folder deepwork_sdk/ are siblings.
SDK_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "deepwork_sdk"))
if SDK_PATH not in sys.path:
    sys.path.insert(0, SDK_PATH)

# --- 2. Import from the generated SDK ---
from openapi_client.api.default_api import DefaultApi
from openapi_client.models.session_create import SessionCreate
from openapi_client.models.pause_request import PauseRequest
from openapi_client.configuration import Configuration
from openapi_client.api_client import ApiClient

# --- 3. Configure the client ---
config = Configuration(host="http://localhost:8000")  # change URL if needed
client = ApiClient(configuration=config)
api = DefaultApi(client)

# --- 4. Sample Usage ---

# 1. Create a new session
created = api.create_session_sessions_post(
    session_create=SessionCreate(
        title="Study Algorithms",
        goal="Finish Dynamic Programming",
        scheduled_duration=90
    )
)
print("✔ Created Session:", created)

# 2. Start the session
started = api.start_session_sessions_session_id_start_patch(session_id=created.id)
print("✔ Started Session:", started)

# 3. Pause the session with a reason
paused = api.pause_session_sessions_session_id_pause_patch(
    session_id=created.id,
    pause_request=PauseRequest(reason="Phone call")
)
print("✔ Paused Session:", paused)

# 4. Resume the session
resumed = api.resume_session_sessions_session_id_resume_patch(session_id=created.id)
print("✔ Resumed Session:", resumed)

# 5. Complete the session
completed = api.complete_session_sessions_session_id_complete_patch(session_id=created.id)
print("✔ Completed Session:", completed)

# 6. Get history (paginated)
history = api.get_sessions_history_sessions_history_get(offset=0, limit=10)
print("\n✔ Session History:")
for h in history:
    print(f"- [{h.id}] {h.title} ({h.status}) — Pauses: {h.pauses_count}, Duration: {h.actual_duration}")
    for intr in h.interruptions:
        print(f"    • {intr.pause_time}: {intr.reason}")
