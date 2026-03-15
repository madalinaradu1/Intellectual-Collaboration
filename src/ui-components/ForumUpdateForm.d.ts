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
export declare type ForumUpdateFormInputValues = {
    title?: string;
    groupName?: string;
    description?: string;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
};
export declare type ForumUpdateFormValidationValues = {
    title?: ValidationFunction<string>;
    groupName?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    createdBy?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    updatedAt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ForumUpdateFormOverridesProps = {
    ForumUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    groupName?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    createdBy?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ForumUpdateFormProps = React.PropsWithChildren<{
    overrides?: ForumUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    forum?: any;
    onSubmit?: (fields: ForumUpdateFormInputValues) => ForumUpdateFormInputValues;
    onSuccess?: (fields: ForumUpdateFormInputValues) => void;
    onError?: (fields: ForumUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ForumUpdateFormInputValues) => ForumUpdateFormInputValues;
    onValidate?: ForumUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ForumUpdateForm(props: ForumUpdateFormProps): React.ReactElement;
