---
layout: doc
title: 第 6 讲 课堂实操任务
breadcrumb: 课堂实操 (第 6 讲)
---

# 随堂实操任务清单 <span class="subtitle">第 6 讲</span>

> 💡 **操作指南**：点击每个任务右上角的 **“复制模板代码 📋”**，在您的 IDE（IntelliJ IDEA / VS Code）中打开对应类文件并补全核心代码。运行结果请参考下方的 **“预期控制台输出”** 进行自测比对。

[← 返回《Java程序设计》大纲](/courses/java-programming-2026-fall)

---

<PracticeCard
  :task-no="1"
  title="JVM 栈帧模型与参数值传递 (Pass by Value) 本质演示"
  class-name="ValuePassDemo.java"
  template-code="/**&#10; * JVM 栈帧模型与参数值传递 (Pass by Value) 本质演示&#10; * @author MatNoble&#10; */&#10;public class ValuePassDemo {&#10;    public static void changeBasic(int a) {&#10;        a = 999; // 修改局部变量副本，外部实参不受影响&#10;    }&#10;&#10;    public static void changeArray(int[] arr) {&#10;        arr[0] = 888; // 通过地址副本修改堆内存对象，外部受影响&#10;    }&#10;&#10;    public static void main(String[] args) {&#10;        int x = 10;&#10;        int[] nums = { 1, 2, 3 };&#10;&#10;        changeBasic(x);&#10;        changeArray(nums);&#10;&#10;        System.out.printf(&quot;基本类型 x 结果: %d (预期 10)\n&quot;, x);&#10;        System.out.printf(&quot;数组元素 nums[0] 结果: %d (预期 888)\n&quot;, nums[0]);&#10;    }&#10;}"
  output-text=""
>

```java
/**
 * JVM 栈帧模型与参数值传递 (Pass by Value) 本质演示
 * @author MatNoble
 */
public class ValuePassDemo {
    public static void changeBasic(int a) {
        a = 999; // 修改局部变量副本，外部实参不受影响
    }

    public static void changeArray(int[] arr) {
        arr[0] = 888; // 通过地址副本修改堆内存对象，外部受影响
    }

    public static void main(String[] args) {
        int x = 10;
        int[] nums = { 1, 2, 3 };

        changeBasic(x);
        changeArray(nums);

        System.out.printf("基本类型 x 结果: %d (预期 10)\n", x);
        System.out.printf("数组元素 nums[0] 结果: %d (预期 888)\n", nums[0]);
    }
}
```

</PracticeCard>

<PracticeCard
  :task-no="2"
  title="方法重载 (Overload) 规则与多形态计算"
  class-name="MethodOverloadDemo.java"
  template-code="/**&#10; * 方法重载 (Overload) 规则与多形态计算&#10; * @author MatNoble&#10; */&#10;public class MethodOverloadDemo {&#10;    public static int add(int a, int b) {&#10;        return a + b;&#10;    }&#10;&#10;    public static double add(double a, double b) {&#10;        return a + b;&#10;    }&#10;&#10;    public static int add(int a, int b, int c) {&#10;        return a + b + c;&#10;    }&#10;&#10;    public static void main(String[] args) {&#10;        System.out.println(&quot;两个整数相加: &quot; + add(10, 20));&#10;        System.out.println(&quot;两个浮点相加: &quot; + add(3.14, 2.71));&#10;        System.out.println(&quot;三个整数相加: &quot; + add(1, 2, 3));&#10;    }&#10;}"
  output-text=""
>

```java
/**
 * 方法重载 (Overload) 规则与多形态计算
 * @author MatNoble
 */
public class MethodOverloadDemo {
    public static int add(int a, int b) {
        return a + b;
    }

    public static double add(double a, double b) {
        return a + b;
    }

    public static int add(int a, int b, int c) {
        return a + b + c;
    }

    public static void main(String[] args) {
        System.out.println("两个整数相加: " + add(10, 20));
        System.out.println("两个浮点相加: " + add(3.14, 2.71));
        System.out.println("三个整数相加: " + add(1, 2, 3));
    }
}
```

</PracticeCard>

<PracticeCard
  :task-no="3"
  title="阶乘与斐波那契数列 (递归 vs 迭代性能与调用栈)"
  class-name="RecursionDemo.java"
  template-code="/**&#10; * 随堂实操任务 6：阶乘与斐波那契数列 (递归 vs 迭代性能与调用栈)&#10; * @author MatNoble&#10; */&#10;public class RecursionDemo {&#10;    // 递归计算阶乘 (必须有基线条件防止 StackOverflowError)&#10;    public static long factorial(int n) {&#10;        if (n &lt;= 1) return 1;&#10;        return n * factorial(n - 1);&#10;    }&#10;&#10;    // 迭代计算斐波那契数列 (高效，无栈溢出风险)&#10;    public static long fibonacci(int n) {&#10;        if (n &lt;= 1) return n;&#10;        long a = 0, b = 1;&#10;        for (int i = 2; i &lt;= n; i++) {&#10;            long temp = a + b;&#10;            a = b;&#10;            b = temp;&#10;        }&#10;        return b;&#10;    }&#10;&#10;    public static void main(String[] args) {&#10;        System.out.println(&quot;10 的阶乘 (10!): &quot; + factorial(10));&#10;        System.out.println(&quot;斐波那契数列第 20 项: &quot; + fibonacci(20));&#10;    }&#10;}"
  output-text=""
>

```java
/**
 * 随堂实操任务 6：阶乘与斐波那契数列 (递归 vs 迭代性能与调用栈)
 * @author MatNoble
 */
public class RecursionDemo {
    // 递归计算阶乘 (必须有基线条件防止 StackOverflowError)
    public static long factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }

    // 迭代计算斐波那契数列 (高效，无栈溢出风险)
    public static long fibonacci(int n) {
        if (n <= 1) return n;
        long a = 0, b = 1;
        for (int i = 2; i <= n; i++) {
            long temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    }

    public static void main(String[] args) {
        System.out.println("10 的阶乘 (10!): " + factorial(10));
        System.out.println("斐波那契数列第 20 项: " + fibonacci(20));
    }
}
```

</PracticeCard>

