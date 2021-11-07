import styles from "./styles.module.css";

const h1 = (props) => {
   const { title } = props;
   return (
      <span className={styles.h1} {...props}>
         {title}
      </span>
   );
};

const h2 = (props) => {
   const { title } = props;
   return (
      <span className={styles.h2} {...props}>
         {title}
      </span>
   );
};

const h3 = (props) => {
   const { title } = props;
   return (
      <span className={styles.h3} {...props}>
         {title}
      </span>
   );
};

const body = (props) => {
   const { title } = props;
   return (
      <span className={styles.body} {...props}>
         {title}
      </span>
   );
};

const bodyHighlight = (props) => {
   const { title } = props;
   return (
      <span className={styles.bodyHighlight} {...props}>
         {title}
      </span>
   );
};

const caption = (props) => {
   const { title } = props;
   return (
      <span className={styles.caption} {...props}>
         {title}
      </span>
   );
};

const underline = (props) => {
   const { title, color } = props;
   return (
      <span className={styles.underline} color={color} {...props}>
         {title}
      </span>
   );
};

export default Text = {
   h1,
   h2,
   h3,
   body,
   caption,
   bodyHighlight,
   underline,
};
