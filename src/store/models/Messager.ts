export interface Room {
    id: number;
    username: string;
    type: string;
    room_id: number;
  }

export interface MessagerState {
  messages: Rooms_msgs,
  message: any,
  notifies: Notify[],  
  current_channel: Channel | null,
  current_room: Room | null,
  current_userPost: User_post,
  current_chat:Chat,
  rooms: Room[],
  searched_channel: Channel[],
  user_posts: User_post[],  
  self_posts: Self_post[],
  recomends: User_post[],  
}

  export interface User_post{ 
    id: number;
    user_id: number;
    username: string;
    avatar:string,
    date: Date;
    post: any;
    emotes: [];
    comments:Comment[];
  }
  export const default_userPost: User_post = {
    id:0,
    user_id: 0,
    username: '',
    avatar:'',
    date: new Date(),
    post:'',
    emotes: [],
    comments:[],

  }
  export const default_chat: Chat = {
    id: 0,
    channel_name: '',
    status: false,
    users: [],
    room_id: 0,
    roles: [],   

  }
  export interface Comment{ 
    id: number;
    user_id: number;
    username: string;
    avatar:string,
    date: Date;
    comment: any;
    emotes: [];
    answers: Comment[]
    count_of_answers: number;    
  }
  export interface Comments{
    [index: number]: Comment[]
  }

  export interface Self_post{  
    id:number;
    user_id: number;
    date: Date;
    content: any;
    emotes: [];
  }
  export interface Channel {
    id: number;
    channel_name: string;
    status: boolean;
    followers: number;
    room_id: number;
    admins: [];
    is_follow: boolean;
  }
  export interface Chat {
    id: number;
    channel_name: string;
    status: boolean;
    users: [];
    room_id: number;
    roles: [];    
  }
  
  export interface Notify {
    from: string;
    message: string;
    avatar: string;
  }
  
  
  export interface Message {
    from_id: number;
    to_id: number;
    user_id: number;
    date: Date;
    content: any;
    emotes: [];
  }
  export interface Rooms_msgs {
    [roomid: number]: Message[];
  }