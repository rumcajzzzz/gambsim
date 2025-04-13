// // /app/api/webhooks/clerk/route.ts or /api/webhooks/clerk.ts
// import { Webhook } from 'svix';
// import { headers } from 'next/headers';
// import { NextResponse } from 'next/server';
// import { buffer } from 'micro';
// import UserStats from '@/lib/models/user.model';
// import { connect } from '@/lib/mongo';

// export async function POST(req: Request) {
//   await connect();

//   const payload = await req.json();
//   const headersList = await headers();

//   const eventType = headersList.get('svix-event-type');
//   const userId = payload.data.id;

//   if (eventType === 'user.created') {
//     await UserStats.create({
//       user_id: userId,
//       email: payload.data.email_addresses[0].email_address,
//       first_name: payload.data.first_name,
//       last_name: payload.data.last_name,
//       username: payload.data.username,
//       profile_image_url: payload.data.image_url,
//     });
//   }

//   if (eventType === 'user.updated') {
//     await UserStats.findOneAndUpdate({ user_id: userId }, {
//       email: payload.data.email_addresses[0].email_address,
//       first_name: payload.data.first_name,
//       last_name: payload.data.last_name,
//       username: payload.data.username,
//       profile_image_url: payload.data.image_url,
//     });
//   }

//   return NextResponse.json({ received: true });
// }
