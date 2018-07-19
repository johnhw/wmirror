"""
Shows basic usage of the Google Calendar API. Creates a Google Calendar API
service object and outputs a list of the next 10 events on the user's calendar.
"""
from googleapiclient import discovery
import datetime
import json
import oauth2client.client

with open("../secrets/keys.json") as f:
    secrets = json.load(f)

def get_events(n=10):
    build = discovery.build    
    service = build('calendar', 'v3', developerKey=secrets["calendar_api_key"])
    # Call the Calendar API
    now = datetime.datetime.utcnow().isoformat() + 'Z' # 'Z' indicates UTC time
    events_result = service.events().list(calendarId=secrets["calendar_id"], timeMin=now,
                                      maxResults=n, singleEvents=True,
                                      orderBy='startTime').execute()

    events = events_result.get('items', [])    
    return {"events":events}

if __name__=="__main__":
    print(get_events(20))
