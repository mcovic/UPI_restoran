export class User {
    id: number;
    name: string;
    surname: string;
    username: string;
    email: string;
    password: string;
    role_id: number;

    constructor(id: number, name: string, surname: string, username: string, email: string, password: string, role_id: number) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role_id = role_id;
    }
}