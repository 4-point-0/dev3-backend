import { Novu } from '@novu/node';
import * as dotenv from 'dotenv';
dotenv.config();

// TODO: Quick implementation. Maybe we should use a singleton (injectable service).
export const sendNotification = async (
  triggerName: string,
  subscriberId: string,
  payload: any,
) => {
  const novu = new Novu(process.env.NOVU_API_KEY);

  await novu.trigger(triggerName, {
    to: {
      subscriberId,
    },
    payload,
  });
};
