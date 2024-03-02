import { SnackbarOrigin } from "@mui/material";
import { Component } from "react";

export class FormError extends Error {
  constructor(message: string, public title: string) {
    super(message);
    this.name = 'FormError';
  }
}