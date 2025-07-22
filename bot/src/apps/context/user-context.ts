interface UserContext {
  currentOrder?: {
    orderId: number;
  };
}

type UserId = string;

class UserContextManager {
  private store: Map<UserId, UserContext> = new Map();

  setContext(userId: UserId, context: UserContext) {
    const currentContext = this.store.get(userId);

    if (currentContext) {
      throw new Error('Context for this user Id already set');
    }

    this.store.set(userId, context);
  }

  getContext(userId: UserId): UserContext | undefined {
    return this.store.get(userId);
  }

  updateContext(userId: UserId, update: Partial<UserContext>) {
    const currentContext = this.store.get(userId);

    if (!currentContext) {
      throw new Error("Trying to update context that doesn't exist");
    }

    this.store.set(userId, { ...currentContext, ...update });
  }

  clearContext(userId: UserId) {
    this.store.delete(userId);
  }
}

export const userContext = new UserContextManager();

export const setOrderId = (userId: string, orderId: number) => {
  const currentContext = userContext.getContext(userId);

  if (!currentContext) {
    userContext.setContext(userId, {
      currentOrder: { orderId },
    });
  }
};

export const clearOrderId = (userId: string) => {
  const currentContext = userContext.getContext(userId);

  if (currentContext) {
    userContext.clearContext(userId);
  }
};
