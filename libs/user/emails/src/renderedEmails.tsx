import { renderAsync } from "@react-email/render";
import ChangeEmailAttempt, { ChangeEmailAttemptProps } from "./lib/ChangeEmailAttempt";

export const renderChangeEmailAttempt = async (props: ChangeEmailAttemptProps) => renderAsync(<ChangeEmailAttempt  {...props} />, { pretty: true });