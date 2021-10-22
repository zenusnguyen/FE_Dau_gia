import React, { useState } from "react";
import styles from "./styles.module.css";
import Text from "../../components/Text";
import { Switch, Form, Input, DatePicker, Upload, InputNumber } from "antd";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function AddProductPage(props) {
   const [form] = Form.useForm();
   const [autoRenew, setAutoRenew] = useState(false);
   const [isAllUser, setIsAllUser] = useState(true);
   const [editorState, setEditorState] = useState(EditorState.createEmpty());
   const [fileList, setFileList] = useState([
      {
         uid: "-1",
         name: "image.png",
         status: "done",
         url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      },
   ]);
   const dateFormat = "DD/MM/YYYY HH:mm:ss";

   const onChange = ({ fileList: newFileList }) => {
      setFileList(newFileList);
   };

   const onPreview = async (file) => {
      let src = file.url;
      if (!src) {
         src = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj);
            reader.onload = () => resolve(reader.result);
         });
      }
      const image = new Image();
      image.src = src;
      const imgWindow = window.open(src);
      imgWindow.document.write(image.outerHTML);
   };

   const onEditorStateChange = (editorState) => {
      setEditorState(editorState);
   };

   const handleSubmit = () => {
      form.submit();
   };

   const onFinish = (values) => {
      console.log("Success:", values);
      console.log(isAllUser);
      console.log(autoRenew);
      console.log(fileList);
      console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
      console.log(values.endTime.format(dateFormat));
   };

   const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
   };

   return (
      <div className={styles.addProductPage}>
         <div>
            <Text.h3 title="Thêm sản phẩm" />
         </div>
         <div className={styles.content}>
            <div className={styles.left}>
               <Form
                  form={form}
                  name="basic"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  initialValues={{
                     remember: true,
                  }}
               >
                  <div>
                     <div style={{ marginBottom: "8px" }}>
                        <label>
                           <Text.caption title="Tên sản phẩm" />
                        </label>
                     </div>
                     <Form.Item
                        name="name"
                        rules={[
                           {
                              required: true,
                              message: "Tên sản phẩm không được trống!",
                           },
                        ]}
                     >
                        <Input placeholder="Nhập tên sản phẩm" />
                     </Form.Item>
                  </div>
                  <div>
                     <div style={{ marginBottom: "8px" }}>
                        <label className={styles.inputLabel}>
                           <Text.caption title="Giá khởi điểm" />
                        </label>
                     </div>
                     <Form.Item
                        name="price"
                        rules={[
                           () => ({
                              validator(_, value) {
                                 if (!value) {
                                    return Promise.reject(
                                       "Giá khởi điểm không được trống."
                                    );
                                 }
                                 if (value < 0) {
                                    return Promise.reject(
                                       "Giá khởi điểm không hợp lệ."
                                    );
                                 }
                                 if (!parseInt(value)) {
                                    return Promise.reject(
                                       "Giá khởi điểm không hợp lệ."
                                    );
                                 }
                                 return Promise.resolve();
                              },
                           }),
                        ]}
                     >
                        <InputNumber
                           placeholder="Nhập giá khởi điểm"
                           style={{ width: "100%" }}
                        />
                     </Form.Item>
                  </div>
                  <div>
                     <div style={{ marginBottom: "8px" }}>
                        <label className={styles.inputLabel}>
                           <Text.caption title="Bước giá" />
                        </label>
                     </div>
                     <Form.Item
                        name="priceStep"
                        rules={[
                           () => ({
                              validator(_, value) {
                                 if (!value) {
                                    return Promise.reject(
                                       "Bước giá không được trống."
                                    );
                                 }
                                 if (value < 0) {
                                    return Promise.reject(
                                       "Bước giá không hợp lệ."
                                    );
                                 }
                                 return Promise.resolve();
                              },
                           }),
                        ]}
                     >
                        <InputNumber
                           placeholder="Nhập bước giá "
                           style={{ width: "100%" }}
                        />
                     </Form.Item>
                  </div>
                  <div>
                     <div style={{ marginBottom: "8px" }}>
                        <label className={styles.inputLabel}>
                           <Text.caption title="Thời hạn" />
                        </label>
                     </div>
                     <Form.Item
                        name="endTime"
                        rules={[
                           {
                              required: true,
                              message: "Thời hạn không được trống!",
                           },
                        ]}
                     >
                        <DatePicker
                           showTime
                           format={dateFormat}
                           style={{ width: "100%" }}
                           placeholder="Chọn ngày giời"
                        />
                     </Form.Item>
                  </div>
                  <div>
                     <div style={{ marginBottom: "8px" }}>
                        <label className={styles.inputLabel}>
                           <Text.caption title="Giá mua ngay (không bắt buộc)" />
                        </label>
                     </div>
                     <Form.Item
                        name="priceBuy"
                        rules={[
                           () => ({
                              validator(_, value) {
                                 if (value < 0) {
                                    return Promise.reject(
                                       "Giá mua ngay không hợp lệ."
                                    );
                                 }
                                 return Promise.resolve();
                              },
                           }),
                        ]}
                     >
                        <InputNumber
                           placeholder="Nhập giá mua ngay "
                           style={{ width: "100%" }}
                        />
                     </Form.Item>
                     <div className={styles.toggle}>
                        <Text.caption title="Cho phép người chưa có đánh giá tham gia đấu giá" />
                        <Switch
                           defaultChecked
                           onClick={() => setIsAllUser(!isAllUser)}
                        />
                     </div>
                     <div className={styles.toggle}>
                        <Text.caption title="Tự động gia hạn 10 phút trước khi kết thúc đấu giá" />
                        <Switch onClick={() => setAutoRenew(!autoRenew)} />
                     </div>
                  </div>
               </Form>
            </div>
            <div className={styles.right}>
               <div className={styles.upload}>
                  <div style={{ marginBottom: "8px" }}>
                     <label className={styles.inputLabel}>
                        <Text.caption title="Hình ảnh" />
                     </label>
                  </div>
                  <Upload
                     action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                     listType="picture-card"
                     fileList={fileList}
                     onChange={onChange}
                     onPreview={onPreview}
                  >
                     {fileList.length < 5 && "+ Upload"}
                  </Upload>
               </div>
               <div>
                  <div style={{ marginBottom: "8px" }}>
                     <label className={styles.inputLabel}>
                        <Text.caption title="Mô tả sản phẩm" />
                     </label>
                  </div>
                  <div className={styles.textEditor}>
                     <Editor
                        editorState={editorState}
                        toolbarClassName={styles.toolbar}
                        wrapperClassName="wrapperClassName"
                        editorClassName={styles.editor}
                        onEditorStateChange={onEditorStateChange}
                     />
                  </div>
                  <div className={styles.submit}>
                     <button
                        className={styles.btn}
                        type="button"
                        onClick={() => handleSubmit()}
                     >
                        <Text.bodyHighlight title="Cập nhật" />
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
