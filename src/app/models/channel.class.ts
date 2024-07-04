export class Channel {
    name : string;
    description: string;
    members : string[];
    founder: string[];
    isOpenToAll: boolean;

    constructor(obj: any){
        this.name = obj ? obj.name : '';
        this.description = obj?.description ?? '';
        this.members = obj && obj.members ? obj.members : [];
        this.founder = obj ? obj.founder : [];
        this.isOpenToAll = false;
    }

    public toJSON() {
        return {
            name: this.name,
            description: this.description,
            members: this.members,
            founder: this.founder,
            isOpenToAll: this.isOpenToAll,
        }
    }

}