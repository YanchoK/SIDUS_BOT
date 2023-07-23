interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    type: 'admin' | 'regular';
  }
  
  export default User;