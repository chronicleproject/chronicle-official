# Brevo early-access signup

The signup endpoint adds an email address to one Brevo contact list. For a new enrollment, it can send a one-time welcome confirmation through Brevo transactional email. It does not establish that the sending domain is authenticated. Domain authentication is separate from adding contacts to a list and is important for reliable delivery.

Configure these server-side environment variables in the local environment and deployment host:

```text
BREVO_API_KEY=your_private_v3_api_key
BREVO_EARLY_ACCESS_LIST_ID=your_numeric_contact_list_id
BREVO_TRANSACTIONAL_API_KEY=your_private_transactional_api_key
BREVO_SENDER_EMAIL=hello@your-domain.example
BREVO_SENDER_NAME=Chronicle
```

Create a private API key in Brevo under **SMTP & API → API keys** for contacts, and create or select a dedicated **Early access** contact list under **CRM → Contacts → Lists**. The list ID is shown in the list details or returned by Brevo's `GET /v3/contacts/lists` endpoint.

For the welcome email, create a second private key named **Chronicle Welcome Email**, set **Access** to **Restricted**, and grant **Transactional email → All** only; set every other resource to **None**. The contact endpoint needs Contacts access, while the email endpoint needs permission to send transactional messages. See [Brevo's send transactional email API](https://developers.brevo.com/docs/send-a-transactional-email). Set `BREVO_SENDER_EMAIL` to an address registered and verified as a sender in Brevo, and `BREVO_SENDER_NAME` to the display name you want recipients to see. Keep all keys in server-side environment variables; never use a `NEXT_PUBLIC_` name. Restart the local Next.js server after updating `.env.local`.

On the first signup, the route checks whether the address is already in the early-access list, adds it if not, and attempts the welcome email when the transactional key and sender are configured. Repeated signups return an already-enrolled message and do not send another welcome email. If sending fails after enrollment, the signup remains successful and the page says that the welcome email could not be sent. The form can be exercised without Brevo credentials; it will not claim a signup succeeded when contact registration is unavailable.

The endpoint uses Brevo's `GET /v3/contacts/{identifier}` operation to check list membership and `POST /v3/contacts` with `updateEnabled: true` to add an existing Brevo contact to the list without creating a duplicate. See the [Brevo get contact API](https://developers.brevo.com/reference/get-contact-info) and [create contact API](https://developers.brevo.com/reference/create-contact).
