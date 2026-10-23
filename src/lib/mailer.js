import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,   
    pass: process.env.MAIL_PASS,   
  },
});


const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, "&#39;");

export async function sendInquiryEmail({ to, property, inquiry }) {
  const subject = `New Inquiry — ${property.title}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 12px; overflow: hidden;">
      <div style="background: #2e5d42; padding: 24px 32px;">
        <h2 style="color: #ffffff; margin: 0; font-size: 20px;">New Property Inquiry</h2>
        <p style="color: #a8c5b5; margin: 6px 0 0; font-size: 14px;">A visitor is interested in one of your listings</p>
      </div>

      <div style="padding: 28px 32px; background: #ffffff;">
        <h3 style="color: #2e5d42; margin: 0 0 4px; font-size: 16px;">Property</h3>
        <p style="margin: 0 0 20px; font-size: 15px; color: #1a2e22; font-weight: 600;">${esc(property.title)}</p>
        <p style="margin: 0 0 20px; font-size: 14px; color: #6b7c72;">📍 ${esc(property.location)}, ${esc(property.city)}</p>
        <p style="margin: 0 0 28px; font-size: 15px; color: #c8a96e; font-weight: 700;">₹${Number(property.price).toLocaleString('en-IN')}</p>

        <hr style="border: none; border-top: 1px solid #e8e8e8; margin-bottom: 24px;" />

        <h3 style="color: #2e5d42; margin: 0 0 16px; font-size: 16px;">Inquiry Details</h3>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7c72; font-size: 13px; width: 100px;">Name</td>
            <td style="padding: 8px 0; color: #1a2e22; font-size: 14px; font-weight: 600;">${esc(inquiry.name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7c72; font-size: 13px;">Email</td>
            <td style="padding: 8px 0; color: #1a2e22; font-size: 14px;">
              <a href="mailto:${esc(inquiry.email)}" style="color: #2e5d42;">${esc(inquiry.email)}</a>
            </td>
          </tr>
          ${inquiry.phone ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7c72; font-size: 13px;">Phone</td>
            <td style="padding: 8px 0; color: #1a2e22; font-size: 14px;">
              <a href="tel:${esc(inquiry.phone)}" style="color: #2e5d42;">${esc(inquiry.phone)}</a>
            </td>
          </tr>` : ''}
          <tr>
            <td style="padding: 8px 0; color: #6b7c72; font-size: 13px; vertical-align: top;">Message</td>
            <td style="padding: 8px 0; color: #1a2e22; font-size: 14px; line-height: 1.6;">${esc(inquiry.message)}</td>
          </tr>
        </table>
      </div>

      <div style="padding: 16px 32px; background: #f0f4f1; text-align: center;">
        <p style="color: #6b7c72; font-size: 12px; margin: 0;">
          This email was sent from your Estate real estate platform.
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from:    `"Estate Platform" <${process.env.MAIL_USER}>`,
    to,
    replyTo: inquiry.email,
    subject,
    html,
  });
}


export async function sendContactEnquiryEmail({ enquiry }) {
  const {
    name,
    phone,
    email,
    enquiryType,
    message,
  } = enquiry;

  const subject = `New Website Enquiry — ${name}`;

  const html = `
    <div style="
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      background: #f9f9f9;
      border-radius: 12px;
      overflow: hidden;
    ">

      <div style="
        background: #000000;
        padding: 24px 32px;
      ">
        <h2 style="
          color: #ffffff;
          margin: 0;
          font-size: 20px;
        ">
          New Website Enquiry
        </h2>

        <p style="
          color: #d8dfda;
          margin: 6px 0 0;
          font-size: 14px;
        ">
          Someone has submitted an enquiry through your website.
        </p>
      </div>

      <div style="
        padding: 28px 32px;
        background: #ffffff;
      ">

        <h3 style="
          color: #000000;
          margin: 0 0 16px;
          font-size: 16px;
        ">
          Enquiry Details
        </h3>

        <table style="width: 100%; border-collapse: collapse;">

          <tr>
            <td style="
              padding: 8px 0;
              color: #6b7c72;
              font-size: 13px;
              width: 130px;
            ">
              Name
            </td>

            <td style="
              padding: 8px 0;
              color: #000000;
              font-size: 14px;
              font-weight: 600;
            ">
              ${name}
            </td>
          </tr>

          <tr>
            <td style="
              padding: 8px 0;
              color: #6b7c72;
              font-size: 13px;
            ">
              Phone
            </td>

            <td style="
              padding: 8px 0;
              color: #000000;
              font-size: 14px;
            ">
              ${phone}
            </td>
          </tr>

          ${
            email
              ? `
          <tr>
            <td style="
              padding: 8px 0;
              color: #6b7c72;
              font-size: 13px;
            ">
              Email
            </td>

            <td style="
              padding: 8px 0;
              color: #000000;
              font-size: 14px;
            ">
              ${email}
            </td>
          </tr>
          `
              : ""
          }

          ${
            enquiryType
              ? `
          <tr>
            <td style="
              padding: 8px 0;
              color: #6b7c72;
              font-size: 13px;
            ">
              Enquiry Type
            </td>

            <td style="
              padding: 8px 0;
              color: #000000;
              font-size: 14px;
            ">
              ${enquiryType}
            </td>
          </tr>
          `
              : ""
          }

          <tr>
            <td style="
              padding: 8px 0;
              color: #6b7c72;
              font-size: 13px;
              vertical-align: top;
            ">
              Message
            </td>

            <td style="
              padding: 8px 0;
              color: #000000;
              font-size: 14px;
              line-height: 1.6;
            ">
              ${message}
            </td>
          </tr>

        </table>
      </div>

      <div style="
        padding: 16px 32px;
        background: #f0f4f1;
        text-align: center;
      ">
        <p style="
          color: #6b7c72;
          font-size: 12px;
          margin: 0;
        ">
          This email was sent from your company website.
        </p>
      </div>

    </div>
  `;

  await transporter.sendMail({
    from: `"Website Enquiry" <${process.env.MAIL_USER}>`,
    to: process.env.CONTACT_TO || process.env.MAIL_USER,
    replyTo: email || undefined,
    subject,
    html,
  });
}

export async function sendSellPropertyEmail({ form }) {
  const f = form;

  const row = (label, value) =>
    value === undefined || value === null || value === '' ||
    (Array.isArray(value) && value.length === 0)
      ? ''
      : `
      <tr>
        <td style="padding:8px 0;color:#6b7c72;font-size:13px;width:150px;vertical-align:top;">${esc(label)}</td>
        <td style="padding:8px 0;color:#000000;font-size:14px;line-height:1.6;">${esc(
          Array.isArray(value) ? value.join(', ') : value
        )}</td>
      </tr>`;

  const section = (title) =>
    `<h3 style="color:#000000;margin:24px 0 8px;font-size:16px;border-bottom:1px solid #e8e8e8;padding-bottom:6px;">${title}</h3>`;

  const price = Number(f.price);
  const priceText = price ? `₹${price.toLocaleString('en-IN')}` : '';

  const images = (f.images || [])
    .map(
      (url, i) => `
      <a href="${esc(url)}" style="display:inline-block;margin:0 8px 8px 0;">
        <img src="${esc(url)}" alt="Photo ${i + 1}" width="120" height="90"
             style="object-fit:cover;border-radius:8px;border:1px solid #e8e8e8;" />
      </a>`
    )
    .join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;background:#f9f9f9;border-radius:12px;overflow:hidden;">
      <div style="background:#000000;padding:24px 32px;">
        <h2 style="color:#ffffff;margin:0;font-size:20px;">New Property Submission</h2>
        <p style="color:#d8dfda;margin:6px 0 0;font-size:14px;">A seller submitted a property through the Sell form.</p>
      </div>

      <div style="padding:28px 32px;background:#ffffff;">
        ${section('Seller Contact')}
        <table style="width:100%;border-collapse:collapse;">
          ${row('Name', f.name)}
          <tr>
            <td style="padding:8px 0;color:#6b7c72;font-size:13px;">Phone</td>
            <td style="padding:8px 0;font-size:14px;"><a href="tel:${esc(f.phone)}" style="color:#2e5d42;">${esc(f.phone)}</a></td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b7c72;font-size:13px;">Email</td>
            <td style="padding:8px 0;font-size:14px;"><a href="mailto:${esc(f.email)}" style="color:#2e5d42;">${esc(f.email)}</a></td>
          </tr>
        </table>

        ${section('Basic Information')}
        <table style="width:100%;border-collapse:collapse;">
          ${row('Title', f.title)}
          ${row('Property type', f.property_type)}
          ${row('Expected price', priceText)}
          ${row('Description', f.description)}
        </table>

        ${section('Location')}
        <table style="width:100%;border-collapse:collapse;">
          ${row('Address', f.location)}
          ${row('City', f.city)}
          ${row('Area (sq ft)', f.area)}
          ${row('Nearby landmarks', f.nearby_landmarks)}
        </table>

        ${section('Property Details')}
        <table style="width:100%;border-collapse:collapse;">
          ${row('Bedrooms', f.bedrooms)}
          ${row('Bathrooms', f.bathrooms)}
          ${row('Balconies', f.balcony)}
          ${row('Total floors', f.total_floors)}
          ${row('Age of property', f.age_of_property)}
          ${row('Furnishing', f.furnishing)}
          ${row('Transaction type', f.transaction_type)}
          ${row('Parking', f.parking)}
          ${row('Facing', f.facing)}
          ${row('Construction type', f.construction_type)}
          ${row('Highlights', f.property_highlights)}
          ${row('Amenities', f.amenities)}
        </table>

        ${images ? `${section(`Photos (${f.images.length})`)}<div>${images}</div>` : ''}
      </div>

      <div style="padding:16px 32px;background:#f0f4f1;text-align:center;">
        <p style="color:#6b7c72;font-size:12px;margin:0;">Sent from your website's Sell Property form.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Sell Property Form" <${process.env.MAIL_USER}>`,
    to: process.env.ADMIN_TO || process.env.CONTACT_TO || process.env.MAIL_USER,
    replyTo: f.email || undefined,
    subject: `New Property Submission — ${f.title} (${f.city})`,
    html,
  });
}