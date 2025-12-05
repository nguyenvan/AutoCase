// // src/types/design-types.ts
// export type BaseComponentProps = {
//   name?: string;            // Control name on UI
//   xpath?: string;           // Xpath or locator
//   valueField?: string;      // For data-driven mapping
//   isRequired?: boolean;
//   isDisable?: boolean;
//   isVisible?: boolean;
//   errorMessage?: string;
// };

// export type InputProps = BaseComponentProps & {
//   // Input: has all basic props + errorMessage
// };

// export type ButtonProps = BaseComponentProps & {
//   // Button: has no isRequired or errorMessage
// };

// export type LinkProps = BaseComponentProps & {
//   // Link: same as Button
// };

// export type GridProps = BaseComponentProps & {
//   // Grid: only basic props (no valueField?)
// };

// export type ComponentType = "input" | "button" | "link" | "grid";

// export interface ComponentNode {
//   id: string;
//   type: ComponentType;
//   props: InputProps | ButtonProps | LinkProps | GridProps;
//   children?: ComponentNode[];
// }


// src/types/design-types.ts
export type BaseProps = {
  name?: string;
  xpath?: string;
  valueField?: string;
  isRequired?: boolean;
  isDisable?: boolean;
  isVisible?: boolean;
  errorMessage?: string;
};

export type ButtonProps = Omit<BaseProps, "isRequired" | "errorMessage">;
export type LinkProps = ButtonProps;
export type GridProps = Omit<BaseProps, "valueField" | "isRequired" | "errorMessage">;

export type ComponentNode = {
  id: string;
  type: "input" | "button" | "link" | "grid";
  props: BaseProps ;
  children: ComponentNode[];
};
