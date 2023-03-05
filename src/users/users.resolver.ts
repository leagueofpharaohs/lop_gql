import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UpdateUserInput } from './dto';
import { User } from './entities';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => [User], { name: 'getAllUsers' })
  findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Query(() => User, { name: 'getUserById', nullable: true })
  findUserById(@Context() context: any) {
    const id = context.req.user.sub;
    return this.userService.findUserById(id);
  }

  @Query(() => User, { name: 'getUserByInputId', nullable: true })
  findUserByInputId(@Args('id') id: string) {
    return this.userService.findUserById(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.updateUser(updateUserInput);
  }

  @Mutation(() => User, { name: 'deleteUser' })
  removeUser(@Context() context: any) {
    const id = context.req.user.sub;
    return this.userService.removeUser(id);
  }
}
