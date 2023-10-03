const formData = require('form-data');
const Mailgun = require('mailgun.js');

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
	username: 'api',
	key: process.env.MAILGUN_API_KEY,
});

exports.handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: JSON.stringify({error :"Method Not Allowed"}) };
    }

    const params = JSON.parse(event.body);
    const email = params.email;

    console.log("Email to send to:", email);

    try {
        await mg.messages.create('sandbox5a8030a5a8b4433ba5f769c3ea2c706e.mailgun.org', {
            from: "Mailgun Sandbox <postmaster@sandbox5a8030a5a8b4433ba5f769c3ea2c706e.mailgun.org>",
            to: [email],
            subject: "Subscription Successful",
            text: "You have successfully subscribed!",
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "You have successfully subscribed!" })
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error sending email." })
        };
    }
};
