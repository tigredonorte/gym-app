import { Dispatch, UnknownAction } from '@reduxjs/toolkit';

export interface ActionStatus {
  loading: boolean;
  error: string | null;
}

export type RequestStatusses<ActionTypes extends string> = {
  [key in ActionTypes]?: ActionStatus;
};

export interface StateWithStatus<ActionTypes extends string> {
  statuses: RequestStatusses<ActionTypes>;
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