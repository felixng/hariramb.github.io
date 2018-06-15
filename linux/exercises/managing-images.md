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
            <h1 id="managing-images">Managing Images</h1>
<h2 id="making-an-account-on-docker-s-hosted-registry">Making an Account on Docker&#39;s Hosted Registry</h2>
<ol>
<li><p>If you don&#39;t have one already, head over to <a href="http://54.200.33.79:8080/linux/exercises/store.docker.com">http://store.docker.com</a> and make an account. This account is synchronized across three services:</p>
<ul>
<li><strong>Docker Store</strong>, for browsing official content</li>
<li><strong>Docker Hub</strong>, for sharing community-generated content</li>
</ul>
<p>For the rest of this workshop, <code>&lt;Docker ID&gt;</code> refers to the username you chose for this account.</p>
</li>
</ol>
<h2 id="tagging-and-listing-images">Tagging and Listing Images</h2>
<ol>
<li><p>Download the <code>centos:7</code> image from Docker Store:</p>
<pre><code class="lang-bash">$ docker image pull centos:7
</code></pre>
</li>
<li><p>Make a new tag of this image:</p>
<pre><code class="lang-bash">$ docker image tag centos:7 my-centos:dev
</code></pre>
<p>Note no new image has been created; <code>my-centos:dev</code> is just a pointer pointing to the same image as <code>centos:7</code>.</p>
</li>
<li><p>List your images:</p>
<pre><code class="lang-bash">$ docker image ls
</code></pre>
</li>
<li><p>You should have <code>centos:7</code> and <code>my-centos:dev</code> both listed, but they ought to have the same hash under image ID, since they&#39;re actually the same image.</p>
</li>
</ol>
<h2 id="sharing-images-on-docker-hub">Sharing Images on Docker Hub</h2>
<ol>
<li><p>Push your image to Docker Hub:</p>
<pre><code class="lang-bash">$ docker image push my-centos:dev
</code></pre>
<p>You should get an <code>authentication required</code> error.</p>
</li>
<li><p>Login by doing <code>docker login</code>, and try pushing again. The push fails again because we haven&#39;t namespaced our image correctly for distribution on Docker Hub; all images you want to share on Docker Hub must be named like <code>&lt;Docker ID&gt;/&lt;repo name&gt;[:&lt;optional tag&gt;]</code>.</p>
</li>
<li><p>Retag your image to be namespaced properly, and push again:</p>
<pre><code class="lang-bash">$ docker image tag my-centos:dev &lt;Docker ID&gt;/my-centos:dev
$ docker image push &lt;Docker ID&gt;/my-centos:dev
</code></pre>
</li>
<li><p>Search Docker Hub for your new <code>&lt;Docker ID&gt;/my-centos</code> repo, and confirm that you can see the <code>:dev</code> tag therein.</p>
</li>
<li><p>Next, write a Dockerfile that uses <code>&lt;Docker ID&gt;/my-centos:dev</code> as its base image, and installs any application you like on top of that. Build the image, and simultaneously tag it as <code>:1.0</code>:</p>
<pre><code class="lang-bash">$ docker image build -t &lt;Docker ID&gt;/my-centos:1.0 .
</code></pre>
</li>
<li><p>Push your <code>:1.0</code> tag to Docker Hub, and confirm you can see it in the appropriate repo.</p>
</li>
<li><p>Finally, list the images currently on your node with <code>docker image ls</code>. You should still have the version of your image that wasn&#39;t namespaced with your Docker Hub user name; delete this using <code>docker image rm</code>:</p>
<pre><code class="lang-bash">$ docker image rm my-centos:dev
</code></pre>
<p>Only the tag gets deleted, not the actual image. The image is still referenced by another tag.</p>
</li>
</ol>
<h2 id="using-private-images">Using Private Images</h2>
<ol>
<li><p>Explore the UI on your Docker Hub repo <code>&lt;Docker ID&gt;/my-centos</code>, and find the toggle to make that repo private.</p>
</li>
<li><p>Pair up with someone sitting next to you, and try to pull their image:</p>
<pre><code class="lang-bash">$ docker image pull &lt;partners Docker ID&gt;/my-centos:1.0
</code></pre>
<p>Their private repo should be invisible to you at this time.</p>
</li>
<li><p>Add each other as Collaborators to your <code>my-centos</code> repo, and pull again; if all has gone well, you should now be able to pull their repo. Also check to see that you can see each other&#39;s repo on your &#39;Repositories&#39; tab of your Docker Hub profile.</p>
</li>
</ol>
<h2 id="conclusion">Conclusion</h2>
<p>In this exercise, we saw how to name and tag images with <code>docker image tag</code>; explored the correct naming conventions necessary for pushing images to your Docker Hub account with <code>docker image push</code>; learned how to remove old images with <code>docker image rm</code>; and learned how to make repos private and share them with collaborators on Docker Hub.</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>