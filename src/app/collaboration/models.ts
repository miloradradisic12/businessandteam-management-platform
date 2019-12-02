import UserProfileModel from 'app/core/models/UserProfileModel';


export class ChatCredentialsModel {
  user_id: number;
  token: string;
}


export class ChatRoomModel {
  room_id: number;
  title: string;
}


export class ChatMessageModel {
  constructor() {
    this.attachments = [];
    this.options = [];
  }
  id: string;
  name: string;
  username: string;
  text: string;
  time: Date;
  userId: string;
  user?: UserProfileModel;

  message_type: string;
  attachments: AttachmentMessageModel[];
  is_reply: boolean;
  options: DecisionPollOption[];
  flag: boolean;
}

export class rocketChartMessageModel {
  constructor() {
    this.mentions = [];
    this.attachments = [];
    this.channels = [];
  }
  _updatedAt: Date;
  u: {
    username: string;
    _id: string;
    name: string;
  };
  groupable: boolean;
  mentions: any[];
  _id: string;
  message_type: string;
  file: {
    _id: string;
    name: string;
    type: string;
  };
  rid: string;
  msg: string;
  attachments: any[];
  ts: Date;
  channels: any[];
}

export class AttachmentMessageModel {
  text: string;
  author_icon: string;
  message_link: string;
  attachments:AttachmentMessageModel[] = [] ;
  author_name: string;
  translations: string;
  ts: Date;

  title_link_download: boolean;
  title_link: string;
  description: string;
  title: string; // file name
  type: string; // type of file

  file: string;
  msg: string;

  image_type:string;
  image_preview:string;
  image_url:string;
}

export class mentionsChartMessageModel {
  _id: string;
  username: string;
}

export class DecisionPollOption {
  id: number;
  option: string;
  addOption: boolean;

  percentage: number;
  votes: number;
}
