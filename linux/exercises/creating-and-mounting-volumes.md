<html>
<head>
    <title></title>
    <link href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' rel='stylesheet' integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u' crossorigin='anonymous'>
    <link href="../../app.css" rel="stylesheet" >
</head>
<body>
    <nav class="navbar navbar-default">
    <div class="container">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="../../index.html"><img class="logo" src="https://www.docker.com/sites/all/themes/docker/assets/images/brand-full.svg" alt="Docker" title="Docker"/></a>
        </div>
    </div><!-- /.container-fluid -->
    </nav>
    <div class="container">
    <div class="row">
        <h1></h1>
        <div class="content">
            <h1 id="creating-and-mounting-volumes">Creating and Mounting Volumes</h1>
<h2 id="creating-a-volume">Creating a Volume</h2>
<ol>
<li><p>Create a volume called <code>test1</code>:</p>
<pre><code class="lang-bash">$ docker volume create --name test1
</code></pre>
</li>
<li><p>Run <code>docker volume ls</code> and verify that you can see your <code>test1</code> volume.</p>
</li>
<li><p>Execute a new <code>centos</code> container and mount the <code>test1</code> volume. Map it to the path <code>/www/website</code> and run bash as your process:</p>
<pre><code class="lang-bash">$ docker container run -it -v test1:/www/website centos:7 bash
</code></pre>
</li>
<li><p>Inside the container, verify that you can get to <code>/www/website</code>:</p>
<pre><code class="lang-bash">$ cd /www/website
</code></pre>
</li>
<li><p>Create a file called <code>test.txt</code> inside the <code>/www/website</code> folder:</p>
<pre><code class="lang-bash">$ echo &#39;hello there&#39; &gt; test.txt
</code></pre>
</li>
<li><p>Exit the container without stopping it by hitting <code>CTRL + P + Q</code>.</p>
</li>
</ol>
<h2 id="creating-volumes-with-containers">Creating Volumes with Containers</h2>
<ol>
<li><p>Commit the updated container as a new image called test and tag it as <code>1.0</code>:</p>
<pre><code class="lang-bash">$ docker container commit &lt;container ID&gt; test:1.0
</code></pre>
</li>
<li><p>Execute a new container with your test image and go into its bash shell:</p>
<pre><code class="lang-bash">$ docker container run -it test:1.0 bash
</code></pre>
</li>
<li><p>Verify that the <code>/www/website</code> folder exists. Are there any files inside it? Exit this container.</p>
</li>
<li><p>Run <code>docker container ls</code> to ensure that your first container is still running in preparation for the next step.</p>
</li>
</ol>
<blockquote>
<p>In this section, we saw how to create and mount a volume, and add data to it from within a container. We also saw that making an image out of a running container via <code>docker container commit</code> does <em>not</em> capture any information from volumes mounted inside the container; volume data is outside the layered filesystem in this sense. Note however that the mountpoint <code>/www/website</code> <em>was</em> captured in image creation; the mountpoint directory is created in the container layer itself, while the contents of the volume remain external to it.</p>
</blockquote>
<h2 id="finding-the-host-mountpoint">Finding the Host Mountpoint</h2>
<ol>
<li><p>Run <code>docker volume inspect</code> on the <code>test1</code> volume to find out where it is mounted on the host machine (see the &#39;Mountpoint&#39; field):</p>
<pre><code class="lang-bash">$ docker volume inspect test1
</code></pre>
</li>
<li><p>Elevate your user privileges to root:</p>
<pre><code class="lang-bash">$ sudo su
</code></pre>
</li>
<li><p>Change directory into the volume path found in step 1:</p>
<pre><code class="lang-bash">$ cd /var/lib/docker/volumes/test1/_data
</code></pre>
</li>
<li><p>Run <code>ls</code> and verify you can see the <code>test.txt</code> file you created inside your original container.</p>
</li>
<li><p>Create another file called <code>test2.text</code> inside this directory:</p>
<pre><code class="lang-bash">$ touch test2.txt
</code></pre>
</li>
<li><p>Exit the superuser account:</p>
<pre><code class="lang-bash">$ exit
</code></pre>
</li>
<li><p>Use <code>docker container exec</code> to log back into the shell of your <code>centos</code> container that is still running:</p>
<pre><code class="lang-bash">$ docker container exec -it &lt;container ID&gt; bash
</code></pre>
</li>
<li><p>Change directory into the <code>/www/website</code> folder, and verify that you can see both the <code>test.txt</code> and <code>test2.txt</code> files. Files written to the volume on the host listed by <code>docker volume inspect</code> appear in the filesystem of every container that mounts it.</p>
</li>
</ol>
<h2 id="deleting-volumes">Deleting Volumes</h2>
<ol>
<li><p>After exiting your container and returning to the host&#39;s bash prompt, attempt to delete the <code>test1</code> volume:</p>
<pre><code class="lang-bash">$ docker volume rm test1
</code></pre>
<p>Deletion fails since the volume is still mounted to a container.</p>
</li>
<li><p>Delete the remaining container without using any options:</p>
<pre><code class="lang-bash">$ docker container rm -f &lt;container ID&gt;
</code></pre>
</li>
<li><p>Run <code>docker volume ls</code> and check the result; notice our <code>test1</code> volume is still present, since removing containers doesn&#39;t affect mounted volumes.</p>
</li>
<li><p>Check to see that the <code>test.txt</code> and <code>test2.txt</code> files are also still present in your volume on the host:</p>
<pre><code class="lang-bash">$ sudo ls /var/lib/docker/volumes/test1/_data
</code></pre>
</li>
<li><p>Delete the <code>test1</code> volume:</p>
<pre><code class="lang-bash">$ docker volume rm test1
</code></pre>
<p>Deletion succeeds now that no containers are using the volume.</p>
</li>
<li><p>Run <code>docker volume ls</code> and make sure the <code>test1</code> volume is in fact gone.</p>
</li>
</ol>
<h2 id="conclusion">Conclusion</h2>
<p>Volumes are the Docker-preferred tool for persisting data beyond the lifetime of a container. In this exercise, we saw how to create and destroy volumes; how to mount volumes when running a container; how to find their locations on the host (under <code>/var/lib/docker/volumes</code>) and in the container using <code>docker volume inspect</code> and <code>docker container inspect</code>; and how they interact with the container&#39;s union file system.</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>