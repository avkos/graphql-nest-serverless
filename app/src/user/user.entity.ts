import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {Field, Int, ObjectType} from "@nestjs/graphql";

@Entity()
@ObjectType()
export class User {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id: number;

    @Column({nullable: false})
    @Field({nullable: false})
    name: string;

    @Column({nullable: true})
    @Field({nullable: true})
    dob: Date;

    @Column({nullable: true})
    @Field({nullable: true})
    address: string;

    @Column({nullable: true})
    @Field({nullable: true})
    description: string;

    @Column({nullable: true})
    @Field({nullable: true})
    imageUrl: string;

    @Column({nullable: true, default: new Date()})
    @Field({nullable: true})
    createdAt: Date;

    @Column({nullable: true, default: new Date()})
    @Field({nullable: true})
    updatedAt: Date;
}

@ObjectType()
export class UserSearchResult {
    @Field(type => Int)
    total: number;

    @Field(type => [User])
    list: User[];
}
