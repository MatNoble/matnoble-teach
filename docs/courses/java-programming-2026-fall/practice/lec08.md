---
layout: doc
title: 第 8 讲 课堂实操任务
breadcrumb: 课堂实操 (第 8 讲)
---

# 随堂实操任务清单 <span class="subtitle">第 8 讲</span>

> 💡 **操作指南**：点击每个任务右上角的 **“复制模板代码 📋”**，在您的 IDE（IntelliJ IDEA / VS Code）中打开对应类文件并补全核心代码。运行结果请参考下方的 **“预期控制台输出”** 进行自测比对。

[← 返回《Java程序设计》大纲](/courses/java-programming-2026-fall)

---

<PracticeCard
  :task-no="1"
  title="动态列表 ArrayList 增删改查与包装类自动装箱演示"
  class-name="ArrayListDemo.java"
  template-code="import java.util.ArrayList;&#10;import java.util.Collections;&#10;&#10;/**&#10; * 动态列表 ArrayList 增删改查与包装类自动装箱演示&#10; * @author MatNoble&#10; */&#10;public class ArrayListDemo {&#10;    public static void main(String[] args) {&#10;        // 泛型动态集合&#10;        ArrayList&lt;String&gt; students = new ArrayList&lt;&gt;();&#10;&#10;        // 1. 添加元素&#10;        students.add(&quot;张三&quot;);&#10;        students.add(&quot;李四&quot;);&#10;        students.add(&quot;王五&quot;);&#10;        students.add(1, &quot;赵六&quot;); // 插入到索引 1&#10;&#10;        System.out.println(&quot;当前花名册: &quot; + students);&#10;        System.out.println(&quot;花名册总人数: &quot; + students.size());&#10;&#10;        // 2. 查询与修改&#10;        System.out.println(&quot;第 0 号学生: &quot; + students.get(0));&#10;        students.set(2, &quot;李小四&quot;);&#10;&#10;        // 3. 排序&#10;        Collections.sort(students);&#10;        System.out.println(&quot;字典序排序后: &quot; + students);&#10;    }&#10;}"
  output-text=""
>

```java
import java.util.ArrayList;
import java.util.Collections;

/**
 * 动态列表 ArrayList 增删改查与包装类自动装箱演示
 * @author MatNoble
 */
public class ArrayListDemo {
    public static void main(String[] args) {
        // 泛型动态集合
        ArrayList<String> students = new ArrayList<>();

        // 1. 添加元素
        students.add("张三");
        students.add("李四");
        students.add("王五");
        students.add(1, "赵六"); // 插入到索引 1

        System.out.println("当前花名册: " + students);
        System.out.println("花名册总人数: " + students.size());

        // 2. 查询与修改
        System.out.println("第 0 号学生: " + students.get(0));
        students.set(2, "李小四");

        // 3. 排序
        Collections.sort(students);
        System.out.println("字典序排序后: " + students);
    }
}
```

</PracticeCard>

<PracticeCard
  :task-no="2"
  title="经典冒泡排序 (优化提前跳出版)"
  class-name="BubbleSortDemo.java"
  template-code="import java.util.Arrays;&#10;&#10;/**&#10; * 经典冒泡排序 (优化提前跳出版)&#10; * @author MatNoble&#10; */&#10;public class BubbleSortDemo {&#10;    public static void bubbleSort(int[] arr) {&#10;        int n = arr.length;&#10;        for (int i = 0; i &lt; n - 1; i++) {&#10;            boolean swapped = false;&#10;            for (int j = 0; j &lt; n - 1 - i; j++) {&#10;                if (arr[j] &gt; arr[j + 1]) {&#10;                    int temp = arr[j];&#10;                    arr[j] = arr[j + 1];&#10;                    arr[j + 1] = temp;&#10;                    swapped = true;&#10;                }&#10;            }&#10;            if (!swapped) break; // 若无交换，说明已经排好序&#10;        }&#10;    }&#10;&#10;    public static void main(String[] args) {&#10;        int[] data = { 64, 34, 25, 12, 22, 11, 90 };&#10;        System.out.println(&quot;排序前: &quot; + Arrays.toString(data));&#10;        bubbleSort(data);&#10;        System.out.println(&quot;冒泡排序后: &quot; + Arrays.toString(data));&#10;    }&#10;}"
  output-text=""
>

```java
import java.util.Arrays;

/**
 * 经典冒泡排序 (优化提前跳出版)
 * @author MatNoble
 */
public class BubbleSortDemo {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break; // 若无交换，说明已经排好序
        }
    }

    public static void main(String[] args) {
        int[] data = { 64, 34, 25, 12, 22, 11, 90 };
        System.out.println("排序前: " + Arrays.toString(data));
        bubbleSort(data);
        System.out.println("冒泡排序后: " + Arrays.toString(data));
    }
}
```

</PracticeCard>

<PracticeCard
  :task-no="3"
  title="动态学生成绩花名册与降序排行榜管理系统"
  class-name="StudentRosterManager.java"
  template-code="import java.util.ArrayList;&#10;import java.util.Collections;&#10;&#10;/**&#10; * 随堂实操任务 8：动态学生成绩花名册与降序排行榜管理系统&#10; * @author MatNoble&#10; */&#10;public class StudentRosterManager {&#10;    public static void main(String[] args) {&#10;        ArrayList&lt;Double&gt; scoreList = new ArrayList&lt;&gt;();&#10;        scoreList.add(88.5);&#10;        scoreList.add(95.0);&#10;        scoreList.add(72.0);&#10;        scoreList.add(64.5);&#10;        scoreList.add(91.0);&#10;&#10;        // 降序排序&#10;        scoreList.sort(Collections.reverseOrder());&#10;&#10;        System.out.println(&quot;=========================================&quot;);&#10;        System.out.println(&quot;          学生成绩降序排行榜          &quot;);&#10;        System.out.println(&quot;-----------------------------------------&quot;);&#10;        for (int i = 0; i &lt; scoreList.size(); i++) {&#10;            System.out.printf(&quot;  第 %d 名 : %6.2f 分\n&quot;, (i + 1), scoreList.get(i));&#10;        }&#10;        System.out.println(&quot;=========================================&quot;);&#10;    }&#10;}"
  output-text=""
>

```java
import java.util.ArrayList;
import java.util.Collections;

/**
 * 随堂实操任务 8：动态学生成绩花名册与降序排行榜管理系统
 * @author MatNoble
 */
public class StudentRosterManager {
    public static void main(String[] args) {
        ArrayList<Double> scoreList = new ArrayList<>();
        scoreList.add(88.5);
        scoreList.add(95.0);
        scoreList.add(72.0);
        scoreList.add(64.5);
        scoreList.add(91.0);

        // 降序排序
        scoreList.sort(Collections.reverseOrder());

        System.out.println("=========================================");
        System.out.println("          学生成绩降序排行榜          ");
        System.out.println("-----------------------------------------");
        for (int i = 0; i < scoreList.size(); i++) {
            System.out.printf("  第 %d 名 : %6.2f 分\n", (i + 1), scoreList.get(i));
        }
        System.out.println("=========================================");
    }
}
```

</PracticeCard>

