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
import {
   EditorState,
   convertToRaw,
   ContentState,
   convertFromRaw,
   convertFromHTML,
} from "draft-js";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { upLoadImages } from "../../services/uploadImage";
import { createProduct } from "../../services/productApi";
import { useSelector, useDispatch } from "react-redux";
import { get } from "../../services/productApi";
import { getAll as getAllCategory, getById } from "../../services/categoryApi";
import { BACKEND_DOMAIN } from "../../constants";
import LoadingPage from "../LoadingPage";
import moment from "moment";

export default function ProductInfoPage(props) {
   const { productId } = props;
   const [form] = Form.useForm();
   const [autoRenew, setAutoRenew] = useState(false);
   const [isAllUser, setIsAllUser] = useState(true);
   const [fileList, setFileList] = useState([]);
   const dateFormat = "DD/MM/YYYY HH:mm:ss";
   const [images, setImages] = useState([]);
   const [description, setDescription] = useState("");
   const { user } = useSelector((state) => state.user);
   const [categoryOptions, setCategoryOptions] = useState([]);
   const [category, setCategory] = useState([]);
   const [product, setProduct] = useState({});
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
         console.log(options);
         const files = resProduct.images.map((image, i) => {
            return {
               uid: `-${i + 1}`,
               name: "image.png",
               status: "done",
               url: `${BACKEND_DOMAIN}${image}`,
            };
         });
         setFileList(files);
         setCategory([resProduct.categoryID, resProduct.subCategoryId]);
         // resProduct.description = EditorState.createWithContent(
         //    ContentState.createFromBlockArray(
         //       convertFromHTML(resProduct.description)
         //    )
         // );
         const html = "<p>Your content</p>";
         const contentBlock = htmlToDraft(html);
         console.log(contentBlock);
         // const contentState = ContentState.createFromBlockArray(
         //    contentBlock.contentBlocks
         // );
         // resProduct.description = contentState;
         //console.log(EditorState.createWithContent(contentState));
         console.log(
            EditorState.createWithContent(
               ContentState.createFromBlockArray(
                  convertFromHTML("<p>My initial content.</p>")
               )
            )
         );
         form.setFieldsValue({
            name: resProduct.title,
            price: resProduct.startPrice,
            priceStep: resProduct.priceStep,
            maxPrice: resProduct.maxPrice,
            endTime: moment(resProduct.endTime),
            category: [resProduct.categoryID, resProduct.subCategoryId],
            // des: EditorState.createWithContent(
            //    ContentState.createFromBlockArray(
            //       convertFromHTML("<p>My initial content.</p>")
            //    )
            // ),
         });
         setCategoryOptions(options);
         setProduct(resProduct);
         setIsLoading(false);
      };
      fetchData();
   }, [productId, form]);

   const onChange = ({ fileList: newFileList }) => {
      console.log(newFileList);
      setFileList(newFileList);
   };

   const onChangeCategory = (data) => {
      console.log("data: ", data);
      setCategory(data);
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

   const onContentStateChange = (contentState) => {
      console.log(contentState);
      setDescription(contentState?.blocks[0]?.text);
   };

   const handleSubmit = async (e) => {
      console.log(description);
      // e.preventDefault();
      // if (images.length < 3) {
      //    message.error("Sản phẩm cần ít nhất 3 tấm ảnh!");
      // } else {
      //    const formData = await form.getFieldValue();
      //    const data = {
      //       ...formData,
      //       title: formData.name,
      //       images: images,
      //       autoRenew,
      //       description,
      //       ownerId: user?.user?.id,
      //       status: "processing",
      //       currentPrice: formData?.price,
      //       isAllUser,
      //       view: 0,
      //       categoryID: category[0],
      //       subCategoryId: category[1],
      //       maxPrice: formData?.maxPrice || 0,
      //    };
      //    console.log("data: ", data);
      //    await createProduct(data)
      //       .then((result) => {
      //          message.success("Cập nhật thành công ");
      //          form.resetFields();
      //          setFileList([]);
      //       })
      //       .catch((error) => message.error(error.message));
      // }
   };

   const onFinish = (values) => {
      console.log("values: ", values);
      // e.preventDefault();
      //  console.log(isAllUser);
      //  console.log(autoRenew);
      //  console.log(fileList);
      //  console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
      //  console.log(values.endTime.format(dateFormat));
   };

   const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
   };

   const handleUpload = async (data) => {
      await upLoadImages(data)
         .then((res) => {
            setImages([...images, res[0]?.url]);
         })
         .catch((err) => {
            console.log("err: ", err);
         });
   };
   return (
      <div className={styles.addProductPage}>
         <div>
            <Text.h3 title="Chỉnh sửa sản phẩm" />
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
                              <Text.caption title="Danh mục" />
                           </label>
                        </div>
                        <Form.Item
                           name="category"
                           rules={[
                              () => ({
                                 validator(_, value) {
                                    if (!value) {
                                       return Promise.reject(
                                          "Danh mục không được trống."
                                       );
                                    }
                                    return Promise.resolve();
                                 },
                              }),
                           ]}
                        >
                           <Cascader
                              placeholder="Vui lòng chọn danh mục "
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
                           name="maxPrice"
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
                        <Form.Item
                           name="des"
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
                           <Editor
                              toolbarClassName={styles.toolbar}
                              wrapperClassName="wrapperClassName"
                              editorClassName={styles.editor}
                              onContentStateChange={onContentStateChange}
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
                        action={handleUpload}
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
                           toolbarClassName={styles.toolbar}
                           wrapperClassName="wrapperClassName"
                           editorClassName={styles.editor}
                           onContentStateChange={onContentStateChange}
                        />
                     </div>
                     <div className={styles.submit}>
                        <button className={styles.btn} onClick={handleSubmit}>
                           <Text.bodyHighlight title="Cập nhật" />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
