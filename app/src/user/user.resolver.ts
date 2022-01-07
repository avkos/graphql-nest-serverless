import {Args, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {User,UserSearchResult} from './user.entity';
import {TUserCreate, TUserUpdate, UserService} from './user.service';

@Resolver(of => User)
export class UsersResolver {
    constructor(
        private userService: UserService,
    ) {
    }

    @Mutation(returns => User)
    async createUser(
        @Args('name', {type: () => String}) name: string,
        @Args('address', {type: () => String}) address: string = '',
        @Args('description', {type: () => String}) description: string = '',
        @Args('imageUrl', {type: () => String}) imageUrl: string = '',
        @Args('dob', {type: () => String}) dob: string = null,
    ) {
        return this.userService.create({
            name,
            address,
            description,
            imageUrl,
            dob: dob ? new Date(dob) : null
        } as TUserCreate);
    }

    @Query(returns => User)
    async getUser(@Args('id', {type: () => Int}) id: number) {
        return this.userService.findById(id);
    }

    @Query(returns => UserSearchResult)
    async getAllUsers(
        @Args('searchText', {type: () => String}) searchText: string,
        @Args('take', {type: () => Int}) take: number=10,
        @Args('skip', {type: () => Int}) skip: number=0,
    ) {
        return this.userService.findAll(searchText, take, skip)
    }

    @Mutation(returns => User)
    async updateUser(
        @Args('id', {type: () => Int}) id: number,
        @Args('name', {type: () => String}) name: string,
        @Args('address', {type: () => String}) address: string = '',
        @Args('description', {type: () => String}) description: string = '',
        @Args('imageUrl', {type: () => String}) imageUrl: string = '',
        @Args('dob', {type: () => String}) dob: string = null,
    ) {
        return this.userService.updateById(id, {
            name,
            address,
            description,
            imageUrl,
            dob: dob ? new Date(dob) : null
        } as TUserUpdate);
    }

    @Mutation(returns => Boolean)
    async deleteUser(@Args('id', {type: () => Int}) id: number) {
        return this.userService.deleteById(id);
    }

}
