import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { BalanceService } from './balance.service';
import { BalanceInput } from './dto/add-balance.input';
import { UpdateBalanceInput } from './dto/update-balance.input';
import { Balance } from './entities';
import { ReturnBuy } from './entities/BuyReturn.entity';

@Resolver()
export class BalanceResolver {
  constructor(private readonly balanceService: BalanceService) {}

  @Mutation(() => Balance, { name: 'setBalance' })
  setBalance(@Args('balanceInput') balanceInput: BalanceInput) {
    return this.balanceService.createBalance(balanceInput);
  }

  @Mutation(() => ReturnBuy, { name: 'buyToken' })
  buyToken(@Args('buyInput') buyInput: UpdateBalanceInput) {
    return this.balanceService.buyToken(buyInput);
  }
}
