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
            <h1 id="plugins">Plugins</h1>
<p>Plugins are used to extend the capabilities of the Docker Engine. In this exercise, we&#39;ll make a Docker volume available via SSH to nodes throughout our datacenter.</p>
<h2 id="installing-a-plugin">Installing a Plugin</h2>
<ol>
<li><p>Plugins can be hosted on Docker Store or any other (private) repository. Let&#39;s start with Docker Store. Browse to <a href="https://store.docker.com">https://store.docker.com</a> and enter <code>vieux/sshfs</code> in the search box. The result should show you the plugin that we are going to work with.</p>
</li>
<li><p>Install the plugin into our Docker Engine:</p>
<pre><code class="lang-bash">$ docker plugin install vieux/sshfs
</code></pre>
<p>The system should ask us for permission to use privileges. In the case of the <code>sshfs</code> plugin there are 4 privileges. Answer with <code>y</code>.</p>
</li>
<li><p>Once we have successfully installed some plugins we can use the <code>ls</code> command to see the status of each of the installed plugins. Execute:</p>
<pre><code class="lang-bash">$ docker plugin ls
</code></pre>
</li>
</ol>
<h2 id="enabling-and-disabling-a-plugin">Enabling and Disabling a Plugin</h2>
<ol>
<li><p>Once a plugin is installed it is <code>enabled</code> by default. We can disable it using this command:</p>
<pre><code class="lang-bash">$ docker plugin disable vieux/sshfs
</code></pre>
<p>only when a plugin is disabled can certain operations on it be executed.</p>
</li>
<li><p>The plugin can be (re-) enabled by using this command:</p>
<pre><code class="lang-bash">$ docker plugin enable vieux/sshfs
</code></pre>
<p>Play with the above commands and notice how the status of the plugin changes when displaying it with <code>docker plugin ls</code>.</p>
</li>
</ol>
<h2 id="inspecting-a-plugin">Inspecting a Plugin</h2>
<ol>
<li><p>We can also use the <code>inspect</code> command to further inspect all the attributes of a given plugin. Execute the following command:</p>
<pre><code class="lang-bash">$ docker plugin inspect vieux/sshfs
</code></pre>
<p>and examine the output. Specifically note that there are two sections in the metadata called <code>Env</code>, one is under <code>Config</code> and the other under <code>Settings</code>. This is where the list of environment variables are listed that the author of the plugin has defined. In this specific situation we can see that there is a single variable called <code>DEBUG</code> defined. Its initial value is <code>0</code>.</p>
</li>
<li><p>We can use the <code>set</code> command to change values of the environment variables. Execute:</p>
<pre><code class="lang-bash">$ docker plugin set vieux/sshfs DEBUG=1
</code></pre>
<p>and then inspect again the metadata of the plugin. Notice how the value of <code>DEBUG</code> has been adjusted. Only the one under the <code>Settings</code> node changed but the one under the <code>Config</code> node still shows the original (default) value. Please note that the above command can only be executed if the plugin has been disabled first.</p>
</li>
<li><p>We could also have defined the value of the environment variables during installation of the plugin, namely:</p>
<pre><code class="lang-bash">$ docker plugin install vieux/sshfs DEBUG=1
</code></pre>
</li>
</ol>
<h2 id="using-the-plugin">Using the Plugin</h2>
<blockquote>
<p><strong>Note:</strong> This exercise requires that you have access to a folder on a remote host which you can access via <code>SSH</code> with <code>username</code> and <code>password</code>. This can either be a host provided to you by your trainer or your own host if you have any.</p>
</blockquote>
<ol>
<li><p>To use the plugin we create a Docker volume:</p>
<pre><code class="lang-bash">$ docker volume create -d vieux/sshfs \
    -o sshcmd=&lt;user@host:path&gt; \
    -o password=&lt;password&gt; \
    sshvolume
</code></pre>
<p>replace <code>user</code>, <code>host</code>, <code>path</code> and <code>password</code> by values provided to you by the trainer, or if you have your own remote server you can <code>SSH</code> into with username/password then you can use that one.</p>
</li>
<li><p>Now we can use that volume to access the remote folder and work with it as follows. Execute the following command to run an <code>alpine</code> container which has access to the remote volume:</p>
<pre><code class="lang-bash">$ docker container run --rm -it -v sshvolume:/data alpine sh
</code></pre>
</li>
<li><p>Inside the container navigate to the <code>/data</code> folder and create a new file:</p>
<pre><code class="lang-bash">$ cd /data
$ echo &#39;Hello from client!&#39; &gt; &lt;your-name&gt;.txt
$ ls -al
</code></pre>
</li>
<li><p>If you created the volume from step 1 using the details of your own remote server, SSH into that remote server and check that the file created in step 3 exists. If you used a common remote server setup by the instructor, the instructor will navigate to the appropriate folder on that server and show the presence of the created file.</p>
</li>
</ol>
<h2 id="removing-a-plugin">Removing a Plugin</h2>
<ol>
<li><p>If we don&#39;t want or need this plugin anymore we can remove it using the command:</p>
<pre><code class="lang-bash">$ docker volume rm sshvolume
$ docker plugin disable vieux/sshfs
$ docker plugin rm vieux/sshfs
</code></pre>
<p>Note how we first have to disable the plugin before we can remove it.</p>
</li>
</ol>
<h2 id="conclusion">Conclusion</h2>
<p>Docker follows a &#39;batteries included but swappable&#39; mindset in its product design: everything you need to get started is included, but heavy customization is supprted and encouraged. Docker plugins are one aspect of that flexibility, allowing users to define their own volume and networking behavior.</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>