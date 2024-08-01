// import type { Metadata } from "next";

import { Form, Input, Button, Checkbox } from "@arco-design/web-react";

const FormItem = Form.Item;

// export const metadata: Metadata = {
//     title: "登录页面",
//     description: "系统登录",
// };
const LoginPage = () => {
  return (
    <Form style={{ width: 600 }} autoComplete="off">
      <FormItem label="Username">
        <Input placeholder="please enter your username..." />
      </FormItem>
      <FormItem label="Post">
        <Input placeholder="please enter your post..." />
      </FormItem>
      <FormItem wrapperCol={{ offset: 5 }}>
        <Checkbox>I have read the manual</Checkbox>
      </FormItem>
      <FormItem wrapperCol={{ offset: 5 }}>
        <Button type="primary">Submit</Button>
      </FormItem>
    </Form>
  );
};

export default LoginPage;
