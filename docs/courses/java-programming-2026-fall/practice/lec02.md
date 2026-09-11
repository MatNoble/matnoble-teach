---
layout: doc
title: 第 2 讲 课堂实操任务
breadcrumb: 课堂实操 (第 2 讲)
---

# 随堂实操任务清单 <span class="subtitle">第 2 讲</span>

> 💡 **操作指南**：点击每个任务右上角的 **“复制模板代码 📋”**，在您的 IDE（IntelliJ IDEA / VS Code）中打开对应类文件并补全核心代码。运行结果请参考下方的 **“预期控制台输出”** 进行自测比对。

[← 返回《Java程序设计》大纲](/courses/java-programming-2026-fall)

---

<PracticeCard
  :task-no="1"
  title="基本数据类型取值范围与内存展示"
  class-name="DataTypeRangeDemo.java"
  template-code="/**&#10; * 基本数据类型取值范围与内存展示&#10; * @author MatNoble&#10; */&#10;public class DataTypeRangeDemo {&#10;    public static void main(String[] args) {&#10;        System.out.println(&quot;========== Java 八大基本数据类型范围 ==========&quot;);&#10;        System.out.printf(&quot;byte    : [%d, %d], 占用 %d 字节\n&quot;, Byte.MIN_VALUE, Byte.MAX_VALUE, Byte.BYTES);&#10;        System.out.printf(&quot;short   : [%d, %d], 占用 %d 字节\n&quot;, Short.MIN_VALUE, Short.MAX_VALUE, Short.BYTES);&#10;        System.out.printf(&quot;int     : [%d, %d], 占用 %d 字节\n&quot;, Integer.MIN_VALUE, Integer.MAX_VALUE, Integer.BYTES);&#10;        System.out.printf(&quot;long    : [%d, %d], 占用 %d 字节\n&quot;, Long.MIN_VALUE, Long.MAX_VALUE, Long.BYTES);&#10;        System.out.printf(&quot;float   : [%e, %e], 占用 %d 字节\n&quot;, Float.MIN_VALUE, Float.MAX_VALUE, Float.BYTES);&#10;        System.out.printf(&quot;double  : [%e, %e], 占用 %d 字节\n&quot;, Double.MIN_VALUE, Double.MAX_VALUE, Double.BYTES);&#10;        System.out.printf(&quot;char    : [%d, %d], 占用 %d 字节\n&quot;, (int) Character.MIN_VALUE, (int) Character.MAX_VALUE, Character.BYTES);&#10;        System.out.println(&quot;boolean : true / false&quot;);&#10;        System.out.println(&quot;================================================&quot;);&#10;    }&#10;}"
  output-text=""
>

```java
/**
 * 基本数据类型取值范围与内存展示
 * @author MatNoble
 */
public class DataTypeRangeDemo {
    public static void main(String[] args) {
        System.out.println("========== Java 八大基本数据类型范围 ==========");
        System.out.printf("byte    : [%d, %d], 占用 %d 字节\n", Byte.MIN_VALUE, Byte.MAX_VALUE, Byte.BYTES);
        System.out.printf("short   : [%d, %d], 占用 %d 字节\n", Short.MIN_VALUE, Short.MAX_VALUE, Short.BYTES);
        System.out.printf("int     : [%d, %d], 占用 %d 字节\n", Integer.MIN_VALUE, Integer.MAX_VALUE, Integer.BYTES);
        System.out.printf("long    : [%d, %d], 占用 %d 字节\n", Long.MIN_VALUE, Long.MAX_VALUE, Long.BYTES);
        System.out.printf("float   : [%e, %e], 占用 %d 字节\n", Float.MIN_VALUE, Float.MAX_VALUE, Float.BYTES);
        System.out.printf("double  : [%e, %e], 占用 %d 字节\n", Double.MIN_VALUE, Double.MAX_VALUE, Double.BYTES);
        System.out.printf("char    : [%d, %d], 占用 %d 字节\n", (int) Character.MIN_VALUE, (int) Character.MAX_VALUE, Character.BYTES);
        System.out.println("boolean : true / false");
        System.out.println("================================================");
    }
}
```

</PracticeCard>

<PracticeCard
  :task-no="2"
  title="类型转换与溢出截断演示"
  class-name="TypeCastDemo.java"
  template-code="/**&#10; * 类型转换与溢出截断演示&#10; * @author MatNoble&#10; */&#10;public class TypeCastDemo {&#10;    public static void main(String[] args) {&#10;        // 1. 自动类型提升 (隐式宽化)&#10;        byte b = 42;&#10;        int i = b;&#10;        double d = i;&#10;        System.out.printf(&quot;自动宽化: byte(%d) -&gt; int(%d) -&gt; double(%.1f)\n&quot;, b, i, d);&#10;&#10;        // 2. 强制类型转换 (显式窄化与高位截断)&#10;        int largeInt = 300; // 0x0000012C&#10;        byte narrowByte = (byte) largeInt; // 截断低 8 位 0x2C = 44&#10;        System.out.printf(&quot;强制窄化截断: int(%d) -&gt; byte(%d)\n&quot;, largeInt, narrowByte);&#10;&#10;        // 3. 浮点截断小数部分&#10;        double pi = 3.1415926;&#10;        int intPi = (int) pi;&#10;        System.out.printf(&quot;浮点截断: double(%.7f) -&gt; int(%d)\n&quot;, pi, intPi);&#10;    }&#10;}"
  output-text=""
>

```java
/**
 * 类型转换与溢出截断演示
 * @author MatNoble
 */
public class TypeCastDemo {
    public static void main(String[] args) {
        // 1. 自动类型提升 (隐式宽化)
        byte b = 42;
        int i = b;
        double d = i;
        System.out.printf("自动宽化: byte(%d) -> int(%d) -> double(%.1f)\n", b, i, d);

        // 2. 强制类型转换 (显式窄化与高位截断)
        int largeInt = 300; // 0x0000012C
        byte narrowByte = (byte) largeInt; // 截断低 8 位 0x2C = 44
        System.out.printf("强制窄化截断: int(%d) -> byte(%d)\n", largeInt, narrowByte);

        // 3. 浮点截断小数部分
        double pi = 3.1415926;
        int intPi = (int) pi;
        System.out.printf("浮点截断: double(%.7f) -> int(%d)\n", pi, intPi);
    }
}
```

</PracticeCard>

<PracticeCard
  :task-no="3"
  title="华氏度与摄氏度双向温度换算器"
  class-name="TemperatureConverter.java"
  template-code="/**&#10; * 随堂实操任务 2：华氏度与摄氏度双向温度换算器&#10; * 公式: C = (F - 32) * 5 / 9,  F = C * 9 / 5 + 32&#10; * @author MatNoble&#10; */&#10;public class TemperatureConverter {&#10;    public static void main(String[] args) {&#10;        double celsius = 26.5;&#10;        // ===== TODO: 【实操任务 3】请在此补全代码 =====&#10;        // 提示: 摄氏度转华氏度公式: F = C * 9.0 / 5.0 + 32.0 (注意必须使用浮点数除法 9.0 / 5.0)&#10;        // &#10;        // ============================================&#10;&#10;        System.out.println(&quot;=========================================&quot;);&#10;        System.out.println(&quot;            温标换算结果            &quot;);&#10;        System.out.println(&quot;-----------------------------------------&quot;);&#10;        System.out.printf(&quot;  * 摄氏度 (Celsius)    : %.2f ℃\n&quot;, celsius);&#10;        System.out.printf(&quot;  * 华氏度 (Fahrenheit) : %.2f ℉\n&quot;, fahrenheit);&#10;        System.out.println(&quot;=========================================&quot;);&#10;    }&#10;}"
  output-text="=========================================&#10;            温标换算结果            &#10;-----------------------------------------&#10;  * 摄氏度 (Celsius)    : 26.50 ℃&#10;  * 华氏度 (Fahrenheit) : 79.70 ℉&#10;========================================="
>

```java
/**
 * 随堂实操任务 2：华氏度与摄氏度双向温度换算器
 * 公式: C = (F - 32) * 5 / 9,  F = C * 9 / 5 + 32
 * @author MatNoble
 */
public class TemperatureConverter {
    public static void main(String[] args) {
        double celsius = 26.5;
        // ===== TODO: 【实操任务 3】请在此补全代码 =====
        // 提示: 摄氏度转华氏度公式: F = C * 9.0 / 5.0 + 32.0 (注意必须使用浮点数除法 9.0 / 5.0)
        // 
        // ============================================

        System.out.println("=========================================");
        System.out.println("            温标换算结果            ");
        System.out.println("-----------------------------------------");
        System.out.printf("  * 摄氏度 (Celsius)    : %.2f ℃\n", celsius);
        System.out.printf("  * 华氏度 (Fahrenheit) : %.2f ℉\n", fahrenheit);
        System.out.println("=========================================");
    }
}
```

</PracticeCard>

