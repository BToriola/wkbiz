import React from "react";
import styles from "../../styles/Forms.module.css";

function Input(props) {
  let { title, placeholder, required, value, type } = props;

  return (
    <div className={`w-full my-3 justify-start text-left`}>
      <label className="text-left pl-2 mb-4  font-thin">
        {title || "..."}
        <span className="text-red-500 font-bold">{required && " *"}</span>
      </label>
      <input
        value={value}
        type={type || 'text'}
        placeholder={placeholder || "..."}
        className={`${styles["text-input"]} w-full rounded-lg mt-1 p-2`}
        required={required}
        onKeyDown={(e) => {
          if (e.key == "Enter" && props.onKeyDown) {
            props.onKeyDown(e.target.value)
          }
        }}
        onChange={(e) => {
          if (props.onChange)
            props.onChange(e.target.value);
        }}
      />
      {/* <input
        value={firstName}
        name="firstName"
        onChange={(e) => setFirstName(e.target.value)}
      /> */}
    </div>
  );
}

export default Input;
