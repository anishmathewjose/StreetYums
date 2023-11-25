const Vendor = require('../models/vendor');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mbxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mbxToken });

module.exports.index = async (req, res) => {
    const vendors = await Vendor.find({});
    res.render('vendors/index', { vendors })
}

module.exports.newVendor = (req, res) => {
    res.render('vendors/new');
}

module.exports.createVendor = async (req, res) => {
    const geoData = await geocodingClient.forwardGeocode({
        query: `${req.body.vendor.pincode}`,
        limit: 1
    }).send()
    const vendor = new Vendor(req.body.vendor);
    vendor.geometry = geoData.body.features[0].geometry;
    vendor.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    vendor.author = req.user._id;
    await vendor.save();
    req.flash('success', 'Successfully made a new vendor!');
    res.redirect(`/vendors/${vendor._id}`);
}

module.exports.showVendor = async (req, res) => {
    const vendor = await Vendor.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    if (!vendor) {
        req.flash('error', 'Vendor not to be found!');
        return res.redirect('/vendors');
    }
    res.render('vendors/show', { vendor });
}

module.exports.editVendor = async (req, res) => {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
        req.flash('error', 'Vendor not to be found!');
        return res.redirect('/vendors');
    }
    res.render('vendors/edit', { vendor });
}

module.exports.updateVendor = async (req, res) => {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, { ...req.body.vendor }, { runValidators: true });
    if (req.files.length > 0) {
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        vendor.images.push(...imgs);
        await vendor.save();
    };
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await vendor.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated vendor!')
    res.redirect(`/vendors/${vendor._id}`);
}

module.exports.deleteVendor = async (req, res) => {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (vendor.images.length > 0) {
        for (let image of vendor.images) {
            await cloudinary.uploader.destroy(image.filename);
        }
    }
    console.log()
    req.flash('success', 'Successfully deleted vendor!')
    res.redirect('/vendors');
}