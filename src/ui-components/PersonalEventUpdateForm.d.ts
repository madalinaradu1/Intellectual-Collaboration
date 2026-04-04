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
export declare type PersonalEventUpdateFormInputValues = {
    title?: string;
    date?: string;
    time?: string;
    location?: string;
    notes?: string;
    owner?: string;
};
export declare type PersonalEventUpdateFormValidationValues = {
    title?: ValidationFunction<string>;
    date?: ValidationFunction<string>;
    time?: ValidationFunction<string>;
    location?: ValidationFunction<string>;
    notes?: ValidationFunction<string>;
    owner?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PersonalEventUpdateFormOverridesProps = {
    PersonalEventUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    date?: PrimitiveOverrideProps<TextFieldProps>;
    time?: PrimitiveOverrideProps<TextFieldProps>;
    location?: PrimitiveOverrideProps<TextFieldProps>;
    notes?: PrimitiveOverrideProps<TextFieldProps>;
    owner?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type PersonalEventUpdateFormProps = React.PropsWithChildren<{
    overrides?: PersonalEventUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    personalEvent?: any;
    onSubmit?: (fields: PersonalEventUpdateFormInputValues) => PersonalEventUpdateFormInputValues;
    onSuccess?: (fields: PersonalEventUpdateFormInputValues) => void;
    onError?: (fields: PersonalEventUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: PersonalEventUpdateFormInputValues) => PersonalEventUpdateFormInputValues;
    onValidate?: PersonalEventUpdateFormValidationValues;
} & React.CSSProperties>;
export default function PersonalEventUpdateForm(props: PersonalEventUpdateFormProps): React.ReactElement;
