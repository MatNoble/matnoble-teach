---
layout: doc
title: 第 1 讲 课堂实操任务
breadcrumb: 课堂实操 (第 1 讲)
---

# 随堂实操任务清单 <span class="subtitle">第 1 讲</span>

> 💡 **操作指南**：点击每个任务右上角的 **“复制模板代码 📋”**，在您的 IDE（IntelliJ IDEA / VS Code）中打开对应类文件并补全核心代码。运行结果请参考下方的 **“预期控制台输出”** 进行自测比对。

[← 返回《Java程序设计》大纲](/courses/java-programming-2026-fall)

---

<PracticeCard
  :task-no="1"
  title="经典 HelloWorld 程序"
  class-name="HelloWorld.java"
  template-code="/**&#10; * 经典 HelloWorld 程序&#10; * @author MatNoble&#10; */&#10;public class HelloWorld {&#10;    public static void main(String[] args) {&#10;        // 向控制台输出欢迎信息&#10;        System.out.println(&quot;Hello, Java World!&quot;);&#10;    }&#10;}"
  output-text=""
>

```java
/**
 * 经典 HelloWorld 程序
 * @author MatNoble
 */
public class HelloWorld {
    public static void main(String[] args) {
        // 向控制台输出欢迎信息
        System.out.println("Hello, Java World!");
    }
}
```

</PracticeCard>

<PracticeCard
  :task-no="2"
  title="命令行参数传递演示"
  class-name="ArgsDemo.java"
  template-code="/**&#10; * 命令行参数传递演示&#10; * @author MatNoble&#10; */&#10;public class ArgsDemo {&#10;    public static void main(String[] args) {&#10;        System.out.println(&quot;&gt;&gt;&gt; 接收到命令行参数个数: &quot; + args.length);&#10;        for (int i = 0; i &lt; args.length; i++) {&#10;            System.out.printf(&quot;参数 [%d]: %s\n&quot;, i, args[i]);&#10;        }&#10;    }&#10;}"
  output-text=""
>

```java
/**
 * 命令行参数传递演示
 * @author MatNoble
 */
public class ArgsDemo {
    public static void main(String[] args) {
        System.out.println(">>> 接收到命令行参数个数: " + args.length);
        for (int i = 0; i < args.length; i++) {
            System.out.printf("参数 [%d]: %s\n", i, args[i]);
        }
    }
}
```

</PracticeCard>

<PracticeCard
  :task-no="3"
  title="个人信息格式化名片生成程序"
  class-name="CommWelcome.java"
  template-code="/**&#10; * 随堂实操任务 1：个人信息格式化名片生成程序&#10; * @author MatNoble&#10; */&#10;public class CommWelcome {&#10;    public static void main(String[] args) {&#10;        if (args.length &lt; 2) {&#10;            System.out.println(&quot;=========================================&quot;);&#10;            System.out.println(&quot;使用说明: java CommWelcome &lt;姓名&gt; &lt;学号&gt;&quot;);&#10;            System.out.println(&quot;例如:     java CommWelcome 张三 20240101&quot;);&#10;            System.out.println(&quot;=========================================&quot;);&#10;            return;&#10;        }&#10;        // ===== TODO: 【实操任务 3 - 挖空 1】请在此补全代码 =====&#10;        // 提示: 提取 args 命令行参数 (name, studentId)&#10;        // &#10;        // ============================================&#10;&#10;        System.out.println(&quot;=========================================&quot;);&#10;        System.out.println(&quot;            个人信息名片卡            &quot;);&#10;        System.out.println(&quot;-----------------------------------------&quot;);&#10;        // ===== TODO: 【实操任务 3 - 挖空 2】请在此补全代码 =====&#10;        // 提示: 使用 printf 格式化输出姓名与学号&#10;        // &#10;        // ============================================&#10;        System.out.println(&quot;  * 课程名称 : Java程序设计&quot;);&#10;        System.out.println(&quot;=========================================&quot;);&#10;    }&#10;}"
  output-text="=========================================&#10;            个人信息名片卡            &#10;-----------------------------------------&#10;  * 姓    名 : 张三&#10;  * 学    号 : 20240101&#10;  * 课程名称 : Java程序设计&#10;========================================="
>

```java
/**
 * 随堂实操任务 1：个人信息格式化名片生成程序
 * @author MatNoble
 */
public class CommWelcome {
    public static void main(String[] args) {
        if (args.length < 2) {
            System.out.println("=========================================");
            System.out.println("使用说明: java CommWelcome <姓名> <学号>");
            System.out.println("例如:     java CommWelcome 张三 20240101");
            System.out.println("=========================================");
            return;
        }
        // ===== TODO: 【实操任务 3 - 挖空 1】请在此补全代码 =====
        // 提示: 提取 args 命令行参数 (name, studentId)
        // 
        // ============================================

        System.out.println("=========================================");
        System.out.println("            个人信息名片卡            ");
        System.out.println("-----------------------------------------");
        // ===== TODO: 【实操任务 3 - 挖空 2】请在此补全代码 =====
        // 提示: 使用 printf 格式化输出姓名与学号
        // 
        // ============================================
        System.out.println("  * 课程名称 : Java程序设计");
        System.out.println("=========================================");
    }
}
```

</PracticeCard>

