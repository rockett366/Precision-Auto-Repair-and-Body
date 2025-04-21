import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, date, time } = req.body;

  try {
    
    //error check code
    console.log('Decoded Key Start:\n', process.env.GCAL_PRIVATE_KEY.replace(/\\n/g, '\n').slice(0, 50));
    console.log('Decoded Key End:\n', process.env.GCAL_PRIVATE_KEY.replace(/\\n/g, '\n').slice(-50));

    const auth = new google.auth.JWT(
      process.env.GCAL_CLIENT_EMAIL,
      null,
      process.env.GCAL_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/calendar']
    );

    const calendar = google.calendar({ version: 'v3', auth });

    const eventStart = new Date(`${date}T${time}`);
    const eventEnd = new Date(eventStart.getTime() + 60 * 60 * 1000);

    const event = {
      summary: `Appointment with ${name}`,
      description: `Client email: ${email}`,
      start: {
        dateTime: eventStart.toISOString(),
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: eventEnd.toISOString(),
        timeZone: 'America/Los_Angeles',
      },
    };

    console.log('Inserting event:', event);

    const response = await calendar.events.insert({
      calendarId: process.env.GCAL_CALENDAR_ID,
      resource: event,
    });

    console.log('Google Calendar response:', response.data);

    res.status(200).json({ success: true, eventId: response.data.id });
  } catch (error) {
    console.error('Google Calendar ERROR:', error.response?.data || error.message || error);
    res.status(500).json({ error: 'Failed to create event', message: error.message });
  }
}