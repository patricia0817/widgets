import {createUser, removeUser} from './util';
import SamplesPage from './pages/Samples.page';
import MeetingPage from './pages/MeetingWidget.page';

describe('Meeting Widget', () => {
  let user;
  let room;
  let accessToken;
  let meetingDestination;

  beforeAll(async () => {
    try {
      user = await createUser();
      room = await user.sdk.rooms.create({title: 'Test Room'});
    } catch (error) {
      console.error(error);
      console.error(error.body);
    }

    accessToken = process.env.WEBEX_ACCESS_TOKEN || (user && user.token.access_token);
    meetingDestination = process.env.WEBEX_MEETING_DESTINATION || (room && room.id);

    expect(accessToken).toBeDefined();
    expect(meetingDestination).toBeDefined();
  });

  afterAll(async () => {
    if (user) {
      if (room) {
        await user.sdk.rooms.remove(room).catch(console.error);
      }
      removeUser(user);
    }
  });

  beforeEach(() => {
    SamplesPage.open();
    SamplesPage.setAccessToken(accessToken);
    SamplesPage.navigateToMeetingPage();
  });

  it('has the correct page title', () => {
    expect(SamplesPage.widgetTitle.getText()).toBe('Webex Meeting Widget');
  });

  it('loads', () => {
    MeetingPage.loadWidget(meetingDestination);
    expect(MeetingPage.meetingInfo).toBeDisplayed();
  });
});
