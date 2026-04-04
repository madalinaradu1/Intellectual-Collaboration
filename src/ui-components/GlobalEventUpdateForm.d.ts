/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type GlobalEventUpdateFormInputValues = {
    title?: string;
    date?: string;
    time?: string;
    location?: string;
    notes?: string;
    createdBy?: string;
};
export declare type GlobalEventUpdateFormValidationValues = {
    title?: ValidationFunction<string>;
    date?: ValidationFunction<string>;
    time?: ValidationFunction<string>;
    location?: ValidationFunction<string>;
    notes?: ValidationFunction<string>;
    createdBy?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type GlobalEventUpdateFormOverridesProps = {
    GlobalEventUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    date?: PrimitiveOverrideProps<TextFieldProps>;
    time?: PrimitiveOverrideProps<TextFieldProps>;
    location?: PrimitiveOverrideProps<TextFieldProps>;
    notes?: PrimitiveOverrideProps<TextFieldProps>;
    createdBy?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type GlobalEventUpdateFormProps = React.PropsWithChildren<{
    overrides?: GlobalEventUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    globalEvent?: any;
    onSubmit?: (fields: GlobalEventUpdateFormInputValues) => GlobalEventUpdateFormInputValues;
    onSuccess?: (fields: GlobalEventUpdateFormInputValues) => void;
    onError?: (fields: GlobalEventUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: GlobalEventUpdateFormInputValues) => GlobalEventUpdateFormInputValues;
    onValidate?: GlobalEventUpdateFormValidationValues;
} & React.CSSProperties>;
export default function GlobalEventUpdateForm(props: GlobalEventUpdateFormProps): React.ReactElement;
