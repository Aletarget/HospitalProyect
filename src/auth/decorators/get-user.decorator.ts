import {ExecutionContext, InternalServerErrorException, createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator(
    (data, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;
        console.log(user[data])
        if(!user)
            throw new InternalServerErrorException('Usuario no encontrado')
        return !data ? user: user[data]
    }
)
