import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Text from "../../components/Text";
import {
   Switch,
   Form,
   Input,
   DatePicker,
   Upload,
   InputNumber,
   Cascader,
   message,
} from "antd";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { upLoadImages } from "../../services/uploadImage";
import { updateProduct } from "../../services/productApi";
import { useSelector, useDispatch } from "react-redux";
import { get } from "../../services/productApi";
import { getAll as getAllCategory } from "../../services/categoryApi";
import { BACKEND_DOMAIN } from "../../constants";
import LoadingPage from "../LoadingPage";
import { v4 as uuidv4 } from "uuid";
import ReactHtmlParser from "react-html-parser";
import moment from "moment";

export default function ProductInfoPage(props) {
   const { productId } = props;
   const [form] = Form.useForm();
   const [formDes] = Form.useForm();
   const [autoRenew, setAutoRenew] = useState(false);
   const [isAllUser, setIsAllUser] = useState(true);
   const [fileList, setFileList] = useState([]);
   const dateFormat = "DD/MM/YYYY HH:mm:ss";
   const [images, setImages] = useState([]);
   const { user } = useSelector((state) => state.user);
   const [categoryOptions, setCategoryOptions] = useState([]);
   const [product, setProduct] = useState({});
   const [editorState, setEditorState] = useState(EditorState.createEmpty());
   const [errorImages, setErrorImages] = useState(false);
   const [errorDes, setErrorDes] = useState(false);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         const resProduct = await get(productId);
         const allCategory = await getAllCategory();
         const options = allCategory.map((category) => {
            return {
               value: category.id,
               label: category.name,
               children: category.subCategory.map((sub) => {
                  return {
                     value: sub.id,
                     label: sub.name,
                  };
               }),
            };
         });
         const files = resProduct.images.map((image, i) => {
            return {
               uid: `${uuidv4()}`,
               name: "image.png",
               status: "done",
               src: image,
               url: `${BACKEND_DOMAIN}${image}`,
            };
         });
         setFileList(files);
         setImages(
            files.map((file) => {
               return { key: file.uid, url: file.url, src: file.src };
            })
         );
         setEditorState(
            EditorState.createWithContent(
               ContentState.createFromBlockArray(
                  htmlToDraft(resProduct.description)
               )
            )
         );
         form.setFieldsValue({
            name: resProduct.title,
            price: resProduct.startPrice,
            priceStep: resProduct.priceStep,
            currentPrice: resProduct.currentPrice,
            maxPrice: resProduct.maxPrice,
            endTime: moment(resProduct.endTime),
            category: [resProduct.categoryID, resProduct.subCategoryId],
         });
         formDes.setFieldsValue({
            description: ReactHtmlParser(resProduct.description),
         });
         setIsAllUser(resProduct.isAllUser);
         setAutoRenew(resProduct.autoRenew);
         setCategoryOptions(options);
         setProduct(resProduct);
         setIsLoading(false);
      };
      fetchData();
   }, [productId, form]);

   const onChange = ({ fileList: newFileList }) => {
      if (fileList.length >= 3) {
         setErrorImages(false);
      }
      setFileList(newFileList);
   };

   const onChangeCategory = (data) => {
      console.log("data: ", data);
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
      if (
         !editorState.getCurrentContent().hasText() ||
         editorState.getCurrentContent().getPlainText().trim() === ""
      ) {
         setErrorDes(true);
      } else {
         setErrorDes(false);
      }
      setEditorState(editorState);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (fileList.length < 3) {
         setErrorImages(true);
      } else if (
         !editorState.getCurrentContent().hasText() ||
         editorState.getCurrentContent().getPlainText().trim() === ""
      ) {
         setErrorDes(true);
      } else {
         form.submit();
      }
   };

   const onFinish = (values) => {
      const data = {
         ...values,
         title: values.name,
         images: images.map((image) => image.src),
         autoRenew,
         description: draftToHtml(
            convertToRaw(editorState.getCurrentContent())
         ),
         ownerId: product.ownerId,
         status: "processing",
         startPrice: values?.price,
         currentPrice: values?.price,
         isAllUser,
         view: 0,
         categoryID: values.category[0],
         subCategoryId: values.category[1],
         maxPrice: values?.maxPrice || 0,
      };

      updateProduct(productId, data)
         .then((result) => {
            message.success("C???p nh???t s???n ph???m th??nh c??ng");
         })
         .catch((error) => message.error(error.message));
   };

   const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
   };

   const handleRemove = async (data) => {
      console.log(data);
      const newImage = images.filter((image) => image.key !== data.uid);
      setImages(newImage);
   };

   const handleUpload = async (data) => {
      await upLoadImages(data)
         .then((res) => {
            setImages([
               ...images,
               { key: data.uid, url: res[0]?.url, src: res[0]?.url },
            ]);
         })
         .catch((err) => {
            console.log("err: ", err);
         });
   };
   return (
      <div className={styles.addProductPage}>
         <div>
            <Text.h3 title="Ch???nh s???a s???n ph???m" />
         </div>
         {isLoading ? (
            <LoadingPage />
         ) : (
            <div className={styles.content}>
               <div className={styles.left}>
                  <Form
                     onFinish={onFinish}
                     onFinishFailed={onFinishFailed}
                     form={form}
                     name="basic"
                     autoComplete="off"
                     initialValues={{
                        remember: true,
                     }}
                  >
                     <div>
                        <div style={{ marginBottom: "8px" }}>
                           <label>
                              <Text.caption title="T??n s???n ph???m" />
                           </label>
                        </div>
                        <Form.Item
                           name="name"
                           rules={[
                              {
                                 required: true,
                                 message: "T??n s???n ph???m kh??ng ???????c tr???ng!",
                              },
                           ]}
                        >
                           <Input
                              placeholder="Nh???p t??n s???n ph???m"
                              disabled={
                                 product.status === "sold" ? true : false
                              }
                           />
                        </Form.Item>
                     </div>
                     <div>
                        <div style={{ marginBottom: "8px" }}>
                           <label className={styles.inputLabel}>
                              <Text.caption title="Gi?? kh???i ??i???m" />
                           </label>
                        </div>
                        <Form.Item
                           name="price"
                           rules={[
                              () => ({
                                 validator(_, value) {
                                    if (!value) {
                                       return Promise.reject(
                                          "Gi?? kh???i ??i???m kh??ng ???????c tr???ng."
                                       );
                                    }
                                    if (value < 0) {
                                       return Promise.reject(
                                          "Gi?? kh???i ??i???m kh??ng h???p l???."
                                       );
                                    }
                                    if (!parseInt(value)) {
                                       return Promise.reject(
                                          "Gi?? kh???i ??i???m kh??ng h???p l???."
                                       );
                                    }
                                    return Promise.resolve();
                                 },
                              }),
                           ]}
                        >
                           <InputNumber
                              disabled={
                                 product.currentPrice !== product.startPrice ||
                                 product.status === "sold"
                                    ? true
                                    : false
                              }
                              placeholder="Nh???p gi?? kh???i ??i???m"
                              style={{ width: "100%", color: "#333" }}
                           />
                        </Form.Item>
                     </div>
                     {product.currentPrice !== product.startPrice && (
                        <div>
                           <div style={{ marginBottom: "8px" }}>
                              <label className={styles.inputLabel}>
                                 <Text.caption title="Gi?? hi???n t???i" />
                              </label>
                           </div>
                           <Form.Item name="currentPrice">
                              <InputNumber
                                 disabled
                                 style={{ width: "100%", color: "#333" }}
                              />
                           </Form.Item>
                        </div>
                     )}
                     <div>
                        <div style={{ marginBottom: "8px" }}>
                           <label className={styles.inputLabel}>
                              <Text.caption title="B?????c gi??" />
                           </label>
                        </div>
                        <Form.Item
                           name="priceStep"
                           rules={[
                              () => ({
                                 validator(_, value) {
                                    if (!value) {
                                       return Promise.reject(
                                          "B?????c gi?? kh??ng ???????c tr???ng."
                                       );
                                    }
                                    if (value < 0) {
                                       return Promise.reject(
                                          "B?????c gi?? kh??ng h???p l???."
                                       );
                                    }
                                    return Promise.resolve();
                                 },
                              }),
                           ]}
                        >
                           <InputNumber
                              disabled={
                                 product.status === "sold" ? true : false
                              }
                              placeholder="Nh???p b?????c gi?? "
                              style={{ width: "100%", color: "#333" }}
                           />
                        </Form.Item>
                     </div>

                     <div>
                        <div style={{ marginBottom: "8px" }}>
                           <label className={styles.inputLabel}>
                              <Text.caption title="Danh m???c" />
                           </label>
                        </div>
                        <Form.Item
                           name="category"
                           rules={[
                              () => ({
                                 validator(_, value) {
                                    if (!value) {
                                       return Promise.reject(
                                          "Danh m???c kh??ng ???????c tr???ng."
                                       );
                                    }
                                    return Promise.resolve();
                                 },
                              }),
                           ]}
                        >
                           <Cascader
                              disabled={
                                 product.status === "sold" ? true : false
                              }
                              placeholder="Vui l??ng ch???n danh m???c "
                              options={categoryOptions}
                              onChange={onChangeCategory}
                              className={styles.cascader}
                              style={{ color: "#333" }}
                           />
                        </Form.Item>
                     </div>

                     <div>
                        <div style={{ marginBottom: "8px" }}>
                           <label className={styles.inputLabel}>
                              <Text.caption title="Th???i h???n" />
                           </label>
                        </div>
                        <Form.Item
                           name="endTime"
                           rules={[
                              {
                                 required: true,
                                 message: "Th???i h???n kh??ng ???????c tr???ng!",
                              },
                              () => ({
                                 validator(_, value) {
                                    if (value < moment()) {
                                       return Promise.reject(
                                          "Th???i h???n kh??ng ???????c nh??? h??n th???i gian hi???n t???i."
                                       );
                                    }
                                    return Promise.resolve();
                                 },
                              }),
                           ]}
                        >
                           <DatePicker
                              disabled={
                                 product.status === "sold" ? true : false
                              }
                              showTime
                              format={dateFormat}
                              style={{ width: "100%", color: "#333" }}
                              placeholder="Ch???n ng??y gi???i"
                           />
                        </Form.Item>
                     </div>
                     <div>
                        <div style={{ marginBottom: "8px" }}>
                           <label className={styles.inputLabel}>
                              <Text.caption title="Gi?? mua ngay (kh??ng b???t bu???c)" />
                           </label>
                        </div>
                        <Form.Item
                           name="maxPrice"
                           rules={[
                              () => ({
                                 validator(_, value) {
                                    if (value < 0) {
                                       return Promise.reject(
                                          "Gi?? mua ngay kh??ng h???p l???."
                                       );
                                    }
                                    return Promise.resolve();
                                 },
                              }),
                              ({ getFieldValue }) => ({
                                 validator(_, value) {
                                    if (
                                       !value ||
                                       getFieldValue("price") >= value
                                    ) {
                                       return Promise.reject(
                                          new Error(
                                             "Gi?? mua ngay kh??ng ???????c ??t h??n gi?? kh???i ??i???m"
                                          )
                                       );
                                    } else if (
                                       value <= getFieldValue("currentPrice")
                                    ) {
                                       return Promise.reject(
                                          new Error(
                                             "Gi?? mua ngay kh??ng ???????c ??t h??n gi?? hi???n t???i"
                                          )
                                       );
                                    } else {
                                       return Promise.resolve();
                                    }
                                 },
                              }),
                           ]}
                        >
                           <InputNumber
                              disabled={
                                 product.status === "sold" ? true : false
                              }
                              placeholder="Nh???p gi?? mua ngay "
                              style={{ width: "100%", color: "#333" }}
                           />
                        </Form.Item>
                        <div className={styles.toggle}>
                           <Text.caption title="Cho ph??p ng?????i ch??a c?? ????nh gi?? tham gia ?????u gi??" />
                           <Switch
                              disabled={
                                 product.status === "sold" ? true : false
                              }
                              defaultChecked={isAllUser}
                              onClick={() => setIsAllUser(!isAllUser)}
                           />
                        </div>
                        <div className={styles.toggle}>
                           <Text.caption title="T??? ?????ng gia h???n 10 ph??t tr?????c khi k???t th??c ?????u gi??" />
                           <Switch
                              disabled={
                                 product.status === "sold" ? true : false
                              }
                              defaultChecked={autoRenew}
                              onClick={() => setAutoRenew(!autoRenew)}
                           />
                        </div>
                     </div>
                  </Form>
               </div>
               <div className={styles.right}>
                  <div className={styles.upload}>
                     <div style={{ marginBottom: "8px" }}>
                        <label className={styles.inputLabel}>
                           <Text.caption title="H??nh ???nh" />
                        </label>
                     </div>
                     <Upload
                        disabled={product.status === "sold" ? true : false}
                        onRemove={handleRemove}
                        className={styles.uploadAction}
                        action={handleUpload}
                        listType="picture-card"
                        fileList={fileList}
                        onChange={onChange}
                        onPreview={onPreview}
                     >
                        {fileList.length < 5 && "+ Upload"}
                     </Upload>
                     {errorImages && (
                        <span className={styles.errorMess}>
                           S???n ph???m c???n ??t nh???t 3 t???m ???nh!
                        </span>
                     )}
                  </div>
                  {product.status === "sold" ? (
                     <div>
                        <div style={{ marginBottom: "8px" }}>
                           <label className={styles.inputLabel}>
                              <Text.caption title="M?? t??? s???n ph???m" />
                           </label>
                        </div>
                        {ReactHtmlParser(product.description)}
                     </div>
                  ) : (
                     <div>
                        <div style={{ marginBottom: "8px" }}>
                           <label className={styles.inputLabel}>
                              <Text.caption title="M?? t??? s???n ph???m" />
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
                           {errorDes && (
                              <span className={styles.errorMess}>
                                 M?? t??? s???n ph???m tr???ng!
                              </span>
                           )}
                        </div>
                        <div className={styles.submit}>
                           <button
                              className={styles.btn}
                              onClick={handleSubmit}
                           >
                              <Text.bodyHighlight title="C???p nh???t" />
                           </button>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         )}
      </div>
   );
}
