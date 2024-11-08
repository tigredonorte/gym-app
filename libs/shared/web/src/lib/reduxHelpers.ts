import { Dispatch, UnknownAction } from '@reduxjs/toolkit';

export interface ActionStatus {
  loading: boolean;
  error: string | null;
}

export type RequestStatuses<ActionTypes extends string> = {
  [key in ActionTypes]?: ActionStatus;
};

export interface StateWithStatus<ActionTypes extends string> {
  statuses: RequestStatuses<ActionTypes>;
}

interface RequestDataType<ActionTypes extends string, State extends StateWithStatus<ActionTypes>> {
  actionName: ActionTypes,
  defaultErrorMessage: string,
  skipLoadingUpdate?: boolean,
  dispatch: Dispatch,
  getState: () => State,
  setActionType: (payload: { status: ActionStatus, actionName: ActionTypes }) => UnknownAction,
  request: (state: State) => Promise<unknown>,
}

export const requestData = async<ActionTypes extends string, State extends StateWithStatus<ActionTypes>>({
  actionName,
  defaultErrorMessage,
  dispatch,
  getState,
  setActionType,
  request,
  skipLoadingUpdate,
}: RequestDataType<ActionTypes, State>) => {
  const state = getState();
  const { statuses } = state;

  if (statuses?.[actionName]?.loading) {
    return;
  }

  !skipLoadingUpdate && dispatch(setActionType({ status: { loading: true, error: null }, actionName }));
  try {
    await request(state);
    dispatch(setActionType({ status: { loading: false, error: null }, actionName }));
  } catch (error) {
    console.error(`Error ${defaultErrorMessage}\n\n`, error);
    const message = error instanceof Error ? error.message : `Error ${defaultErrorMessage}`;
    !skipLoadingUpdate && dispatch(setActionType({ status: { loading: false, error: message }, actionName }));
  }
};

export function getStatusesProperty<ActionTypes extends string, Statuses extends RequestStatuses<ActionTypes>>(statuses: Statuses, actions: ActionTypes[]) {
  return <Key extends keyof ActionStatus>(property: Key): ActionStatus[Key] | null => {
    for (const action of actions) {
      const value = statuses[action]?.[property];
      if (value !== undefined && value !== null) {
        return value as ActionStatus[Key];
      }
    }
    return null;
  };
}
